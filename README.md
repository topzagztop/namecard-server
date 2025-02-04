# Server InterHome Backend

## Step 1 
```bash
npm init
```
## Step 2
Create file index.js

```bash
npm i express nodemon cors dotenv bcryptjs jsonwebtoken cloudinary multer morgan express-rate-limit 
```
edit file package.json Script run
```bash
 "scripts": {
    "start": "nodemon index.js"
  },
```

## Step 3
open server port and setup first in index.js
``` bash
require("dotenv").config()

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const app = express();
app.use(express.json())
app.use(cors())
app.use(morgan())


const PORT = 8080
app.listen(PORT, ()=> console.log(`Server is running port ${PORT}`))
```

## Step 4 
create error middleware and create error utils
#### path /middleware
- error.js
```bash
const errorHandler = (err, req, res, next) => {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Internal Server error" });
}

module.exports = errorHandler
```
- not-found.js
```bash
const notFound = (req, res, next) => {
    res.status(404).json({ message: "Resource not found on this server" });
}

module.exports = notFound
```
#### path /utils
createError.js
```bash
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

module.exports = createError
```
#### update file index.js
```bash
// error 
app.use(errorHandler)
app.use(notFound)
```

## Step 5 Create Route and Controllers

```bash
const express = require("express");

const router = express.Router();

router.get("/property/list")
router.post("/property", agentController.createProperty)
router.put("/property/:propertyId")
router.delete("/property/:propertyId")

module.exports = router

```

## Step 6 Prisma
install prisma
```bash
npx prisma init
```
#### edit .env (cc19-nameproject)
```bash
DATABASE_URL="mysql://root:12345678@localhost:3306/cc19-interhome"
```
#### edit file schema.prisma
##### provider = "mysql"
```bash
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

#### model create database
```bash
model User {
  id           Int        @id @default(autoincrement())
  email        String     @unique
  password     String
  firstName    String     @map("first_name")
  lastName     String     @map("last_name")
  phone        String
  qrCode       String     @map("qr_code")
  profileImage String     @map("profile_image")
  role         Role       @default(AGENT)
  properties   Property[]

  @@map("user")
}

enum ListingType {
  SELL
  RENT
}

model Property {
  id             Int              @id @default(autoincrement())
  title          String
  description    String
  area           Decimal
  price          Int
  listingType    ListingType      @map("listing_type")
  address        String
  lat            Float
  lng            Float
  storey         Int?
  bedroom        Int?
  bathroom       Int?
  livingroom     Int?
  kitchen        Int?
  airconditioner Int?
  parking        Int?
  security       Boolean
  club           Boolean
  pool           Boolean
  gym            Boolean
  playground     Boolean
  park           Boolean
  elevator       Boolean
  agentId        Int              @map("agent_id")
  agent          User             @relation(fields: [agentId], references: [id], onDelete: Cascade)
  propertyImages PropertyImages[]
  categoryId     Int              @map("category_id")
  category       Category         @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  provinceId     Int              @map("province_id")
  province       Province         @relation(fields: [provinceId], references: [id], onDelete: Cascade)
  districtId     Int              @map("district_id")
  district       District         @relation(fields: [districtId], references: [id], onDelete: Cascade)
  roadId         Int              @map("road_id")
  road           Road             @relation(fields: [roadId], references: [id], onDelete: Cascade)
  contacts       Contact[]

  @@map("property")
}

model PropertyImages {
  id         Int      @id @default(autoincrement())
  imageUrl   String   @map("image_url")
  propertyId Int      @map("property_id")
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@map("property_images")
}

model Category {
  id         Int        @id @default(autoincrement())
  name       String     @unique
  properties Property[]

  @@map("category")
}

model Province {
  id         Int        @id @default(autoincrement())
  name       String     @unique
  properties Property[]
  districts  District[]
  roads      Road[]

  @@map("province")
}

model District {
  id         Int        @id @default(autoincrement())
  name       String
  properties Property[]
  provinceId Int        @map("province_id")
  province   Province   @relation(fields: [provinceId], references: [id], onDelete: Cascade)

  @@map("district")
}

model Road {
  id         Int        @id @default(autoincrement())
  name       String
  properties Property[]
  provinceId Int        @map("province_id")
  province   Province   @relation(fields: [provinceId], references: [id], onDelete: Cascade)

  @@map("road")
}

model Contact {
  id         Int      @id @default(autoincrement())
  name       String
  email      String
  contact    String
  purpose    String
  other      String?
  propertyId Int      @map("property_id")
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@map("contact")
}
```

#### push to database
```bash
npx prisma db push
```

#### update config prisma.js
```bash
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

module.exports = prisma
```

#### prisma migrate (first migration)
```bash
npx prisma migrate dev --name init
```

## Step 7 auth API and authenticate middleware setup
/middleware >> file authenticate.js
```bash
const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma");

const authenticate = async (req, res, next) => {
  try {
    const autherization = req.headers.autherization;

    if (!autherization || !autherization.startWith("Bearer")) {
      return createError(401, "Unautherization");
    }

    const token = autherization.split(" ")[1];

    if (!token) {
      return createError(401, "Unautherization");
    }

    const jwtPayload = jwt.verify(token, process.env.SECRET_KEY);

    const user = await prisma.user.findFirst({
      where: {
        id: jwtPayload.id,
      },
    });

    if (!user) {
      return createError(400, "User not found");
    }

    delete user.password;

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;

```
#### controlers and routes
file: auth-controllers.js
```bash
const createError = require("../utils/createError");
const prisma = require("../configs/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return createError(404, "Email and Password are required");
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return createError(400, "Type of email and password should be string");
    }

    if (password.length < 8) {
      return createError(
        400,
        "Password length should be at least 8 charactors"
      );
    }

    const isUserExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!isUserExist) {
      return createError(400, "User allready exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.json({ message: "Register Successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return createError(400, "Email and Password should be provideds");
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return createError(
      400,
      "Invalid typeof email and password should be provideds"
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return createError(400, "User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return createError(400, "Email or Password is invalid");
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });

  res.json({ token });
};

```
## Step 8 User routes and User Controllers
file user-routes.js
```bash
const express = require("express");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");
const userController = require("../controllers/user-controllers");

const router = express.Router();

router.get("/", authenticate, userController.getProfile)
router.put("/", authenticate, upload.single("profile"), userController.updateProfile)

module.exports = router
```

file user-controllers.js
```bash
const cloudinary = require("../configs/cloudinary");
const fs = require("fs");
const prisma = require("../configs/prisma")

exports.getProfile = (req, res, next) => {
  res.json({ user: req.user });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const image = req.file
      ? await cloudinary.uploader.upload(req.file.path)
      : null;

    const toUpdateInputs = {
      firstName,
      lastName,
      profileImage: image?.secure_url
    }

    for (let key in toUpdateInputs) {
      if (!toUpdateInputs[key]) {
        delete toUpdateInputs[key];
      }
    }

    const updateUser = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        ...toUpdateInputs,
      }
    })

    res.json({ user: updateUser });

  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
```

## Step 9 Post or Namecard create

