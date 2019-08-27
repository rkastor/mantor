<?php

class Mail {

  public $token = '608377820:AAEwkxPwxnEbZAoZBUndnytiO7pgNszAlhw'; //token telegram 
  public $chat = '-260715325'; //chat id telegram 

  public $saveFolderPhoto = 'tmp'; // имя временной папки

  /**
   * От кого.
   */
  public $fromEmail = '';
  public $fromName = '';
  
  /**
   * Кому.
   */
  public $toEmail = '';
  public $toName = '';
  
  /**
   * Тема.
   */
  public $subject = '';
  
  /**
   * Текст.
   */
  public $body = '';
  
  /**
   * Массив заголовков файлов.
   */
  private $_files = array();
  
  /**
   * Управление дампированием.
   */
  public $dump = false;
  
  /**
   * Директория куда сохранять письма.
   */
  public $dumpPath = '';
  

  /**
   * Проверка существования файла.
   * Если директория не существует - пытается её создать.
   * Если файл существует - к концу файла приписывает префикс.
   */

  private function safeFile($filename)
  {
    $dir = dirname($filename);
    if (!is_dir($dir)) {
      mkdir($dir, 0777, true);
    }
    
    $info   = pathinfo($filename);
    $name   = $dir . '/uploads' . $info['filename']; 
    $ext    = (empty($info['extension'])) ? '' : '.' . $info['extension'];
    $prefix = '';
    
    if (is_file($name . $ext)) {
      $i = 1;
      $prefix = '_' . $i;
      
      while (is_file($name . $prefix . $ext)) {
        $prefix = '_' . ++$i;
      }
    }
    
    return $name . $prefix . $ext;
  }
  
  /**
   * От кого.
   */
  public function from($email, $name = null)
  {
    $this->fromEmail = $email;
    $this->fromName = $name;
  }
  
  /**
   * Кому.
   */
  public function to($email, $name = null)
  {
    $this->toEmail = $email;
    $this->toName = $name;
  }
  
  /**
   * Добавление файла к письму.
   */

  public function addFile($filename) {
    if (is_file($filename)) {
      $name = basename($filename);
      $fp   = fopen($filename, 'rb');  
      $file = fread($fp, filesize($filename));   
      fclose($fp);
      $this->_files[] = array( 
        'Content-Type: application/octet-stream; name="' . $name . '"',   
        'Content-Transfer-Encoding: base64',  
        'Content-Disposition: attachment; filename="' . $name . '"',   
        '',
        chunk_split(base64_encode($file)),
      );
    }
  }
  

  public function uploadsFile($inputType) {
      foreach ($_FILES[$inputType]["error"] as $key => $error) {
          if ($error == UPLOAD_ERR_OK) {
              $tmp_name = $_FILES[$inputType]["tmp_name"][$key];
              $name = basename($_FILES[$inputType]["name"][$key]);
              move_uploaded_file($tmp_name, "$this->saveFolderPhoto/$name");
              $this->addFile($this->saveFolderPhoto.'/'.$name);
          }
      }
   }

   public function deleteFile($inputType) {
    foreach ($_FILES[$inputType]["error"] as $key => $error) {
        $name = basename($_FILES[$inputType]["name"][$key]);
        unlink($this->saveFolderPhoto.'/'.$name);
    }
 }

   public function telegramSendPhoto($inputType) {
    foreach ($_FILES[$inputType]["error"] as $key => $error) {
        $file = basename($_FILES[$inputType]["name"][$key]);     
        $url = preg_replace('/\?.*/', '', $_SERVER['HTTP_REFERER']);
        $this->telegramMessage('Photo', $url.$this->saveFolderPhoto.'/'.$file);
    }
 }


  /**
   * Отправка.
   */
  public function send() {
    if (empty($this->toEmail)) {
      return false;
    }
    
    // От кого.
    $from = (empty($this->fromName)) ? $this->fromEmail : '=?UTF-8?B?' . base64_encode($this->fromName) . '?= <' . $this->fromEmail . '>';
    
    // Кому.
    $array_to = array();
    foreach (explode(',', $this->toEmail) as $row) {
      $row = trim($row);
      if (!empty($row)) {
        $array_to[] = (empty($this->toName)) ? $row : '=?UTF-8?B?' . base64_encode($this->toName) . '?= <' . $row . '>';
      }
    }
    
    // Тема письма.
    $subject = (empty($this->subject)) ? 'No subject' : $this->subject;
    
    // Текст письма.
    $body = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru" lang="ru">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body>
        ' . $this->body . '
      </body>
    </html>';

    // Добавление стилей к тегам.
  
    $boundary = md5(uniqid(time()));
    
    // Заголовок письма.
    $headers = array(
      'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
      'Content-Transfer-Encoding: 7bit',
      'MIME-Version: 1.0',
      'From: ' . $from,
      'Date: ' . date('r')
    );
    
    // Тело письма.
    $message = array(
      '--' . $boundary,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      chunk_split(base64_encode($body))
    );
    
    if (!empty($this->_files)) {
      foreach ($this->_files as $row) {
        $message = array_merge($message, array('', '--' . $boundary), $row);
      }
    }
    
    $message[] = '';
    $message[] = '--' . $boundary . '--';
    $res = array();
    
    foreach ($array_to as $to) {
      // Дамп письма в файл.
      if ($this->dump == true) {
        if (empty($this->dumpPath)) {
          $this->dumpPath = dirname(__FILE__) . '/sendmail';
        }
        
        $dump = array_merge($headers, array('To: ' . $to, 'Subject: ' . $subject, ''), $message);
        $file = $this->safeFile($this->dumpPath . '/' . date('Y-m-d_H-i-s') . '.eml');
        file_put_contents($file, implode("\r\n", $dump));
      }
      $res[] = mb_send_mail($to, $subject, implode("\r\n", $message), implode("\r\n", $headers));
    }
    
    return $res;
  }


  public function telegramMessage($typeMessages, $message) {
      if ($typeMessages == 'Message') {
          $type = 'text';
      } else {
          $type = 'photo';
      }
      fopen("https://api.telegram.org/bot{$this->token}/send{$typeMessages}?chat_id={$this->chat}&parse_mode=html&{$type}={$message}","r");
  }


  public function telegramSend() {
    $arr = array(
      'Новая заявка с сайта:' => $_SERVER['HTTP_ORIGIN'],
      'Имя девушки:' => $_POST['name'],
      'Город:' => $_POST['city'],
      'Возраст:' => $_POST['age'],
      'Телефон:' => $_POST['phone'],
      'instagram:' => $_POST['insta'],
      'Опыт:' => $_POST['experience']
    );
    foreach($arr as $key => $value) {
        $txt .= "<b>".$key."</b> ".$value."%0A";
    };
    $this->telegramMessage('Message', $txt);
    $this->telegramSendPhoto('pictures');

  }
}


$host = $_SERVER['HTTP_HOST'];
$mailFrom = 'info@'.$host;

$mail = new Mail;
$mail->from($mailFrom, $host);
$mail->to('alicebrown12001@gmail.com', 'no-reply');
$mail->subject = 'Заявка с анкеты лендинг-пейдж - '.$_SERVER['HTTP_HOST'];
$mail->body = '
        <p>Пришла заявка с сайта Rabotavescorte - '.$_SERVER['HTTP_HOST'] .'</p>
        <p>
        <b>Имя:</b> ' . $_POST['name'] . '<br>
        <b>Город:</b> ' . $_POST['city'] . '<br>
        <b>Номер телефона:</b> ' . $_POST['phone'] . '<br>
        <b>Возраст:</b> ' . $_POST['age'] . '<br>
        <b>Instagram:</b> ' . $_POST['insta'] . '<br>
        <b>Опыт:</b> ' . $_POST['experience'] . '<br>
        <b>Ниже фото в полный рост и портрет:</b> <br/>'.
        '</p>
';
  
$mail->uploadsFile("pictures");
$mail->telegramSend();
$mail->send();
$mail->deleteFile("pictures");


?>

