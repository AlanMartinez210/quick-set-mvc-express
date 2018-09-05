// アップロードファイルをプレビュー
$(function(){
  $('#myfile').change(function(e){
    //ファイルオブジェクトを取得する
    var file = e.target.files[0];
    var reader = new FileReader();

    //画像でない場合は処理終了
    if(file.type.indexOf("image") < 0){
      alert("画像ファイルを指定してください。");
      return false;
    }

    //アップロードした画像を設定する
    reader.onload = (function(file){
      return function(e){
        $("#img1").attr("src", e.target.result);
        $("#img1").attr("title", file.name);
        $("#img1").imgAreaSelect({
          handles: true,
          onSelectEnd: (img,param)=>{
            $('#parameter').val(JSON.stringify(param));
          }
        });
      };
    })(file);
    reader.readAsDataURL(file);

  });
});
