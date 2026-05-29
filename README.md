# CMS – Backend

Contains all PHP business logic, database access, and server-side controllers.

```
cms-backend/
├── config/
│   └── config.php             # loadPages() / savePages() helpers
├── models/
│   └── db.php                 # MySQLi connection
├── controllers/
│   ├── admin.php              # Admin dashboard (manage pages)
│   ├── addnewPage.php         # Create a new page + file
│   ├── editPage.php           # Rename a page
│   ├── deletePage.php         # Delete a page
│   ├── editArticle.php        # Edit an article (DB update)
│   ├── deleteArticle.php      # Delete an article + its images
│   └── logout.php             # Destroy session & redirect
└── photos/
    └── upload.php             # TinyMCE image upload handler
```
