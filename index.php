<?php
session_start();
include '../app/views/layouts/header.php';
include 'css/style.php';

$page_slug = $_GET['page'] ?? 'home';
?>
<style>
    h1 { text-align: center; color: #0004ff; font-weight: bold; }
    h1:hover { color: #ff0000; }
</style>

<?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin'): ?>
<div class="my-3">
    <a href="../app/views/layouts/content.php?page=<?php echo urlencode($page_slug); ?>"
       class="btn btn-outline-warning">
       <i class="fa-solid fa-file-circle-plus"></i>
    </a>
</div>
<?php endif; ?>

<?php
include '../app/views/layouts/body.php';
include '../app/views/layouts/footer.php';
?>
