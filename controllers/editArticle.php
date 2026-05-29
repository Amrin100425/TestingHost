<?php
session_start();
if ($_SESSION['role'] !== 'admin') {
    die("Access denied. Admins only.");
}
include '../views/layouts/header.php';
$conn = new mysqli("localhost", "root", "", "cms");

$id = intval($_GET['id']);
$page_slug = $_GET['page'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title   = $_POST['artical'];
    $content = $_POST['mytextarea'];

    $stmt = $conn->prepare("UPDATE articles SET title=?, content=? WHERE id=?");
    $stmt->bind_param("ssi", $title, $content, $id);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    header("Location: /cms/public/index.php?page=" . urlencode($page_slug));
    exit;
}
$stmt = $conn->prepare("SELECT title, content FROM articles WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$article = $result->fetch_assoc();
$stmt->close();
$conn->close();
?>
<!DOCTYPE html>
<html>

<head>
    <title>Edit Article</title>
    <?php include __DIR__ . '/../../public/css/style.php'?>
</head>

<body>
    <div class="container mt-4">
        <h4>Edit Article</h4>
        <form method="post">
            <input type="text" class="form-control mb-3" name="artical" value="<?php echo htmlspecialchars($article['title']); ?>" required>
            <textarea id="mytextarea" name="mytextarea"><?php echo $article['content']; ?></textarea>
            <br>
            <button type="submit" class="btn btn-outline-primary"><i class="fa-solid fa-save"></i></button>
        </form>
    </div>
    <script>
        tinymce.init({
            selector: '#mytextarea',
            height: 400,
            plugins: 'image code',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | image code',
            menubar: 'insert',
            relative_urls: false,
            remove_script_host: false,
            document_base_url: 'http://localhost/cms/', 
            images_upload_url: '/cms/Photos/upload.php',
            automatic_uploads: true
        });
    </script>
</body>

</html>