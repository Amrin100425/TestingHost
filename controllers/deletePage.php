<?php
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    die("Access denied. Admins only.");
}
$pages = loadPages();
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    $index = intval($_POST['index']);
    if ($index >= 0 && $index < count($pages)) {
        $deletedPage = $pages[$index];

        if ($deletedPage['url'] === 'index.php' || $deletedPage['url'] === 'public/index.php') {
            $message = '<p style="color: red;">You cannot delete the Home page!</p>';
        } else {
            array_splice($pages, $index, 1);
            savePages($pages);

            $fileName = basename($deletedPage['url']);
            $filePath = __DIR__ . '/../views/pages/' . $fileName;
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            $message = '<p style="color: green;">Page deleted successfully!</p>';
        }
    }
    header("Location: admin.php");
    exit;
}
$pages = loadPages();
