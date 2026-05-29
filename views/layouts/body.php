<?php
require_once __DIR__ . '/../../models/db.php';

$conn = new mysqli("localhost", "root", "", "cms");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$page_slug = isset($_GET['page']) ? $_GET['page'] : basename($_SERVER['PHP_SELF'], ".php");


$stmt = $conn->prepare("SELECT id, title, content, created_at FROM articles WHERE page_slug = ? ORDER BY id ASC");
$stmt->bind_param("s", $page_slug);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    echo "<div class='mt-2'>";
    echo "<div class='article mb-4'>";
    echo "<h2>" . htmlspecialchars($row['title']) . "</h2>";
    echo "<div class='content'>" . $row['content'] . "</div>";

    if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
        echo '<a href="/cms/app/controllers/editArticle.php?id=' . $row['id'] . '&page=' . $page_slug . '" 
             class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-pencil"></i></a> ';

        echo '<a href="/cms/app/controllers/deleteArticle.php?id=' . $row['id'] . '&page=' . $page_slug . '" 
             class="btn btn-sm btn-outline-danger" onclick="return confirm(\'Delete this article?\')">
             <i class="fa-solid fa-trash"></i></a>';
    }
    echo "<p class='text-muted'><small>Posted on: " . $row['created_at'] . "</small></p>";
    echo "</div></div><hr>";
}

$stmt->close();
$conn->close();
