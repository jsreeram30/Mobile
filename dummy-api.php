<?php
// $result = array();
// // $result = json_decode('{"records":[{"content":"aaa","entry_id":"141234","date":"2011-06-15T03:45:46.299Z","id":"","name":"","isSelf":"","picture":""}]}');
// $result = json_decode($HTTP_RAW_POST_DATA);
// $result->success = true;
// $result->records[0]->content = $_POST['content'];
// $result->records[count($result->records)-1]->id = rand(100000,10000000);
// echo(json_encode($result));
// echo $result->records[count($result->records)-1];
// 
echo "Request\n";
print_r($_REQUEST);

echo "\n\n\nPOST\n";
print_r($_POST);


echo "\n\n\nGET\n";
print_r($_GET);

echo "\n\n\nRAW POST DATA\n";
print_r($HTTP_RAW_POST_DATA);

echo "\n\n\nSERVER\n";
print_r($_SERVER);

?>