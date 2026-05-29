<?php
session_start();
$conn = new mysqli("localhost", "root", "", "cms");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $stmt = $conn->prepare("SELECT username, password, role FROM users WHERE username=? AND password=?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {

        $_SESSION['username'] = $username;
        $_SESSION['role'] = $user['role'];

        header("Location: /cms/public/index.php");
        exit;
    } else {
        $err = "Incorrect username or password!";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <?php include __DIR__ . '/public/css/style.php'?>
    <?php include __DIR__ . '/public/css/fontwoodblock.php'?>
</head>
<body style="background-color: white;">
    <form action="" method="post" style="margin-top: 200px; display: flex; justify-content: center; background-color: transparent;">
           <div class="container mt-4" style="max-width:400px; color:White; font-weight: bold; background-color:#023188; padding:20px; border-radius:5px; box-shadow:0 0 10px rgba(8, 8, 8, 0.1);">
            <h2  style="text-align: center; font-weight: bold; font-family: Wood Block CG;">CMS</h2>
            <br>
            <div class="mb-3">
                <input type="text" class="form-control" id="username" name="username" required style="background-color: white;" placeholder="Username">
           </div>
           <div class="mb-3">
                <input type="password" class="form-control" id="password" name="password" required style="background-color: white;" placeholder="Password">
           </div>
           <button type="submit" class="btn btn-outline-success" style="margin-left:135px; font-family: Wood Block CG;"><i class="fa-solid fa-user-lock"></i> Login</button>
        </form>
        <?php if (!empty($err)) : ?>
    <p style="color:red; text-align:center; margin-top:10px;">
        <?php echo htmlspecialchars($err); ?>
    </p>
<?php endif; ?>
</body>
</html>
<?php
echo "<style>body { margin-top: 200px; }</style>";
include __DIR__ . '/app/views/layouts/footer.php';
echo "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
?>

