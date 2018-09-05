window.onload = function() {
  var socket = io();
  var post = document.getElementById('post');
  post.onclick = function(){
    var message = document.getElementById('chattext').value;
    socket.emit('message',{message:message});
    console.log(post)
  }
  socket.on('new message',function(msg){
    var li = document.createElement('li');
    var ul = document.getElementsByTagName('ul')[0]
    li.innerText=msg.message;
    ul.appendChild(li);
  });
}
