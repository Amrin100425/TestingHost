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