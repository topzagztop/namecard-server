# Namecard Server

### env guide
PORT=8000   
DATABASE_URL=***  
SECRET_KEY=***  

---
### Service User
|path |method |authen |params |query | body | 
|:--|:--|:--|:--|:--|:--|
|/auth/register |post |-|-|-|{email, passowrd, firstname, lastname, phone, profile(file)}
|/auth/login|post|-|-|-|{email, password}
|/auth/logout|post|-|-|-|-
|/auth/me|get|y|-|-|-|
|/users/:id|put|y|-|-|{email, username, passowrd, firstname, lastname, phone, profile(file)}|
|/cards/me|get|y|-|-|-|
|/cards/create|post|y|-|-|{businessName, position, businessTel, businessEmail, logo(file), website, line, facebook, instagram, linkedin }|
|/cards/:id|put|y|-|-|{businessName, position, businessTel, businessEmail, logo(file), website, line, facebook, instagram, linkedin}
|/cards|delete|y|:id|-|-
|/contacts-list/me|get|y|-|-|-
|/contacts-list/create|post|y|-|-|{userId,contactId,namecardId}
|/contacts-list|delete|y|:id|-|-
---
### Admin Dashboard (Optional)
|path |method |authen |params |query | body | 
|:--|:--|:--|:--|:--|:--|
|/admin|get|y|-|-|-|
|/admin|delete|y|:id|-|{userId}
|/admin/theme|get|y|-|-|-|
|/admin/theme/create|post|y|-|-|{themeName}|
|/admin/theme/|delete|y|:id|-|-
|/admin/social-link|get|y|-|-|-|
|/admin/social-link/create|post|y|-|-|{socialName,url}|
|/admin/social-link|delete|y|:id|-|-
---