<?php

 global $_FILES;

 $field_name='files';

 $files = $_FILES[$field_name]['tmp_name'];
 $types = $_FILES[$field_name]['type'];
 $names = $_FILES[$field_name]['name'];
 $sizes = $_FILES[$field_name]['size'];

 $all_uploaded = array();
 for( $i = 0; $i < count( $files ); $i++ )
 {
      $file = $files[$i];
      $type = $types[$i];
      $name = $names[$i];

      //write_log( $file."\n" );

      if($file and is_uploaded_file($file) and ($type == 'image/gif' or $type =='image/pjpeg' or $type =='image/jpeg'))
      {
         $ext = pathinfo($name, PATHINFO_EXTENSION);
         $filename = 'upload/'.rand(0, 1000000).'.'.$ext;
         move_uploaded_file($file, $filename );
         $all_uploaded[] = $filename;
     }
 }

//$text = print_r($all_uploaded, true);
//write_log( $text );


print( json_encode($all_uploaded) );

//--------------------------------------


function write_log( $data )
{
    $fp = fopen('log.txt', 'a');
    fwrite($fp, $data);
    fclose($fp);
}

?>