<?php
$token = '';
if (array_key_exists('token', $_POST)) {
  if ($_POST['token'] != '') {
    $token = $_POST['token'];
  }
}
$redirect = '/';
if (array_key_exists('redirect', $_GET)) {
  if ($_GET['redirect'] != '') {
    $redirect = $_GET['redirect'];
  }
}
?>
<script>
  localStorage.setItem('token', '<?=$token?>');
  window.location.href = '<?=$redirect?>';
</script>
