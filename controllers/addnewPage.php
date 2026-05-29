<?php
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    die("Access denied. Admins only.");
}
include '../views/layouts/header.php';
$pages = loadPages();
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'add' && !empty($_POST['title'])) {
        $title = trim($_POST['title']);
        $filename = strtolower($title);
        $filename = preg_replace('/[^a-z0-9]+/', '-', $filename);
        $filename = preg_replace('/-+/', '-', $filename);
        $filename = trim($filename, '-') . '.php';
        $url = 'app/views/pages/' . $filename;

        $exists = false;
        foreach ($pages as $page) {
            if (strtolower($page['title']) === strtolower($title) || $page['url'] === $url) {
                $exists = true;
                break;
            }
        }

        if (!$exists) {
            $pages[] = [
                'title' => $title,
                'url' => $url
            ];
            savePages($pages);
            $filePath = __DIR__ . '/../views/pages/' . $filename;
            if (!file_exists($filePath)) {
                $content = <<<'PHP'
                <?php
                    session_start();
                    include '../layouts/header.php';
                    include '../../../public/css/style.php';
                    ?>
                    <style>
                        h1 { text-align: center; color: #0004ff; font-weight: bold; }
                        h1:hover { color: #ff0000; }
                    </style>


                    <?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin'): ?>
                    <div class="my-3">
                    <a href="../layouts/content.php?page=<?php echo basename(__FILE__, ".php"); ?>"
                        class="btn btn-outline-warning">
                        <i class="fa-solid fa-file-circle-plus"></i>
                    </a>
                    </div>
                    <?php endif; ?>
                    <hr>
                    <?php
                    include '../layouts/body.php';
                    include '../layouts/footer.php';
                ?>
                PHP;
                $content = str_replace("TITLE_PLACEHOLDER", $title, $content);
                file_put_contents($filePath, $content);
            }

            $message = '<p style="color: green;">Page added successfully!</p>';
            header("Location: /cms/" . $url);
            exit;
        } else {
            $message = '<p style="color: red;">Page already exists!</p>';
        }
    } else {
        $message = '<p style="color: red;">Title cannot be empty!</p>';
    }
} ?>
<div class="container">
    <h2>Add New Page</h2>
    <form method="POST">
        <input type="hidden" name="action" value="add">
        <label>Page Title:</label>
        <input type="text" name="title" placeholder="Enter page title" required>
        <br><br>
        <button type="submit" class="btn btn-outline-primary"> <i class="fa-solid fa-file-circle-plus"></i></button>
        <?php if (!empty($message)) echo $message; ?>
    </form>
</div>