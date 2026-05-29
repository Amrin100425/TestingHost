<?php
if (!empty($_FILES['file']['name'])) {
    $filename = time() . '_' . basename($_FILES['file']['name']);
    $targetDir = __DIR__ . '/uploads/';   
    $target    = $targetDir . $filename;

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    if (move_uploaded_file($_FILES['file']['tmp_name'], $target)) {

        echo json_encode(['location' => '/cms/Photos/uploads/' . $filename]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Upload failed']);
    }
}
?>
