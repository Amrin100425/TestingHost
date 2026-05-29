<?php
include '../views/layouts/header.php';
$pages = loadPages();
$index = intval($_GET['index']);
$page = $pages[$index];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $newTitle = trim($_POST['title']);
  $newSlug = preg_replace('/[^a-zA-Z0-9]+/', '-', $newTitle);
  $newSlug = strtolower(trim($newSlug, '-'));
  $newSlug = $newSlug . '.php';
  $oldFilePath = __DIR__ . '/../views/pages/' . basename($page['url']);

  $newFilePath = __DIR__ . '/../views/pages/' . $newSlug;
  if (file_exists($oldFilePath)) {
    rename($oldFilePath, $newFilePath);
  }
  $pages[$index]['title'] = $newTitle;
  $pages[$index]['url']   = $newSlug;
  savePages($pages);

  header("Location: admin.php");
  exit;
}
?>
<!DOCTYPE html>
<html>
<head>
  <title>Edit Page</title>
</head>
<body>
  <div class="container mt-4">
    <h4>Edit Page Name</h4>
    <form method="post">
      <input type="text" class="form-control mb-3" name="title" value="<?php echo htmlspecialchars($page['title']); ?>" required>
      <button type="submit" class="btn btn-primary">Save Changes</button>
    </form>
  </div>
</body>
</html>