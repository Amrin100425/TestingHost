<?php
session_start();
session_destroy();
header("Location: /cms/public/index.php");
exit;
?>
