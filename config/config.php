<?php
function loadPages() {
    $pagesFile = __DIR__ . '/../public/json/pages.json'; 
    if (file_exists($pagesFile)) {
        return json_decode(file_get_contents($pagesFile), true);
    }
    return [];
}

// Save pages to JSON file
function savePages($pages) {
    $pagesFile = __DIR__ . '/../public/json/pages.json'; // same adjustment
    file_put_contents($pagesFile, json_encode($pages, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}
?>