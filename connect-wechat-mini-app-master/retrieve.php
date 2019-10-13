<?php
  header("content-type:text/html;charset=utf-8");  
  header('Access-Control-Allow-Origin:*');//解决跨域问题  
  
  $link = mysqli_connect("localhost","webuser","!~LemonChicken7");
  mysqli_select_db($link, "webuser");
  mysqli_query($link, "SET NAMES 'utf8'");

  $res = mysqli_query($link, "SELECT * FROM `calendar`");

	while ($row = mysqli_fetch_array($res)) {
    echo json_encode($row["name"]);
    echo json_encode($row["wechatid"]);
    echo json_encode($row["peoplenumber"]);
    echo json_encode($row["datetime"]);
    echo ">";
	}
?>
