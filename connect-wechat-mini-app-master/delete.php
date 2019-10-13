<?php
  //Basic header
  header("content-type:text/html;charset=utf-8");  
  header('Access-Control-Allow-Origin:*');
  
  //Connect to database
  $link = mysqli_connect("localhost","webuser","!~LemonChicken7");
  mysqli_select_db($link, "webuser");
  mysqli_query($link, "SET NAMES 'utf8'");

  //Receives data from add.js/formSubmit
  $datetime = $_REQUEST["datetime"];

  $res = mysqli_query($link, "DELETE FROM `calendar` WHERE `datetime` = '$datetime'");

  //Returns success
  echo "success"
?>
