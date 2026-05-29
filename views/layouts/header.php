<?php
require_once __DIR__ . '/../../../config/config.php';

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic Navigation</title>
    <link rel="stylesheet" href="/cms/public/css/style.css">
    <?php include __DIR__ . '/../../../public/css/style.php' ?>
    <?php include __DIR__ . '/../../../public/css/fontwoodblock.php' ?>
</head>

<body>
    <?php
    if (!isset($pages)) {
        $pages = function_exists('loadPages') ? loadPages() : [];
    }

    $currentPage = $_GET['page'] ?? 'home';
    ?>

    <nav class="navbar">
        <h2 style="color:white; font-weight: bold; margin-top: 8px; margin-left: 40px; margin-right: 30px; font-family: 'Wood Block CG', sans-serif;">CMS</h2>

        <?php foreach ($pages as $page): ?>
            <!-- <?php
                    $pageSlug = basename($page['url'], '.php');
                    if (strtolower($pageSlug) === 'home') continue;
                    $isActive = ($pageSlug === $currentPage) ? 'active' : '';
                    ?> -->
            <a href="/cms/public/index.php?page=<?= htmlspecialchars($pageSlug) ?>" class="<?= $isActive ?>">
                <?= htmlspecialchars($page['title']) ?>
            </a>
        <?php endforeach; ?>

        <div style="margin-left:auto; display:flex; gap:15px;">
            <?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') { ?>
                <?php if (isset($_SESSION['username'])): ?>
                    <a style="color: yellow; font-weight: bold;">
                        <i class="fa-solid fa-user"></i> <?= htmlspecialchars($_SESSION['username']) ?>
                    </a>
                <?php endif; ?>
                <?php $isAdmin = ($currentPage === 'admin') ? 'active' : ''; ?>
                <a href="/cms/app/controllers/admin.php?page=admin" class="<?= $isAdmin ?>" style="color:orange;">
                    <i class="fa-solid fa-gear"></i>
                </a>
                <a href="/cms/app/controllers/logout.php" style="color:red;">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </a>
            <?php } else { ?>
                <?php $isLogin = ($currentPage === 'login') ? 'active' : ''; ?>
                <a href="/cms/login.php?page=login" class="<?= $isLogin ?>" style="color:yellow;">
                    <i class="fa-solid fa-lock"></i> Login
                </a>
            <?php } ?>

        </div>
    </nav>

    <div class="container">