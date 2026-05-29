<?php
session_start();
if ($_SESSION['role'] !== 'admin') {
    die("Access denied. Admins only.");
}

$conn = new mysqli("localhost", "root", "", "cms");
$id = intval($_GET['id']);
$page_slug = $_GET['page'];
$stmt = $conn->prepare("SELECT id, title, content, images, created_at, page_slug FROM articles WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$article = $result->fetch_assoc();
$stmt->close();
if ($article) {
    preg_match_all('/<img[^>]+src="([^">]+)"/i', $article['content'], $matches);
    foreach ($matches[1] as $imgPath) {
        $filePath = $_SERVER['DOCUMENT_ROOT'] . parse_url($imgPath, PHP_URL_PATH);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
}

$stmt = $conn->prepare("DELETE FROM articles WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$stmt->close();

$conn->close();
header("Location: /cms/public/index.php?page=" . urlencode($page_slug));
exit;
