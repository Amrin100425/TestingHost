<?php
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    die("Access denied. Admins only.");
}
include '../views/layouts/header.php';
$pages = loadPages();
$message = '';
include 'deletePage.php';
include __DIR__ . '../../../public/css/fontwoodblock.php';
?>
<h1 style="text-align: center; font-family: Wood Block CG;">Manage Pages</h1>

<?= $message ?>
<br>
<h2 style="font-family:Wood Block CG;">Add New Page</h2>
<a href="addnewPage.php" class="btn btn-outline-success">
    <i class="fa-solid fa-file-circle-plus"></i>
</a>
<br>
<br>
<h2 style="font-family: Wood Block CG;">Current Pages</h2>
<table style="font-family: Kantumruy Pro;">
    <tr>
        <th>No</th>
        <th>Title</th>
        <th>Action</th>
    </tr>
    <?php foreach ($pages as $index => $page): ?>
        <tr>
            <td><?= $index + 1 ?></td>
            <td><?= htmlspecialchars($page['title']) ?></td>
            <td>
                <?php
                $fileName = strtolower(basename($page['url']));
                if ($fileName == 'index.php'):
                ?>
                    <span style="color: gray;">Home Page</span>
                <?php else: ?>
                    <a href="editPage.php?index=<?= $index ?>" class="btn btn-sm btn-outline-warning"><i class="fa-regular fa-pen-to-square"></i></a>
                    <form method="POST" style="margin:0; padding:0; display:inline;">
                        <input type="hidden" name="action" value="delete">
                        <input type="hidden" name="index" value="<?= $index ?>">
                        <button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this page?')"><i class="fa-solid fa-trash"></i></button>
                    </form>
                <?php endif; ?>
            </td>
        </tr>
    <?php endforeach; ?>
</table>

<br>
<p><a href="../../public/index.php"><button class="btn btn-outline-primary"><i class="fa-solid fa-circle-arrow-left"></i></button></a></p>

<?php include '../views/layouts/footer.php'; ?>