<?php
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    die("Access denied. Admins only.");
}


include 'header.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title   = $_POST['artical'];
    $content = $_POST['mytextarea'];
    $page_slug = $_POST['page_slug'];

    $conn = new mysqli("localhost", "root", "", "cms");
    if ($conn->connect_error) {
        die("DB Connection failed: " . $conn->connect_error);
    }


    $stmt = $conn->prepare("INSERT INTO articles (title, content, page_slug, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $title, $content, $page_slug);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    header("Location: /cms/public/index.php?page=" . urlencode($page_slug));
exit;

    echo "<p class='alert alert-success'>Article saved successfully!</p>";
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Add Article</title>
    <?php include '../../../public/css/style.php'; ?>
    <?php include '../../../public/css/fontwoodblock.php'; ?>
</head>

<body>
    <div class="container mt-4">
        <h3 style="font-family: Wood Block CG;">Greeting <?php if (isset($_SESSION['username'])): ?>
                <a style="color: blue; font-weight: bold;"><i class="fa-solid fa-user"></i> <?= htmlspecialchars($_SESSION['username']) ?>👋</a>
            <?php endif; ?>
        </h3>
        <br>
        <h3 style="font-family: Kantumruy Pro;">Create Articles</h3>
        <form action="" method="post" enctype="multipart/form-data">
            <h5 style=" color: black; font-weight: bold; font-family: Kantumruy Pro;">Article title: <?php echo htmlspecialchars($_GET['page']); ?></h5>
            <input type="hidden" name="page_slug" value="<?php echo htmlspecialchars($_GET['page']); ?>">
            <input type="text" class="form-control mb-3" placeholder="Enter Article Title" name="artical" required>
            <h5 style=" color: black; font-weight: bold; font-family: Kantumruy Pro;">Add content: </h5>
            <textarea id="mytextarea" name="mytextarea"></textarea>
            <br>
            <button type="submit" class="btn btn-outline-primary"><i class="fa-solid fa-upload"></i></button>
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