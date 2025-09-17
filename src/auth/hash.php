<?php
$passwords = ["admin123", "cliente123"];

foreach ($passwords as $pwd) {
    echo $pwd . " => " . password_hash($pwd, PASSWORD_BCRYPT) . "\n";
}
