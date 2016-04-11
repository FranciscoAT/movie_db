
$('#deleteAccount').submit(function(e){
  e.preventDefault();
  if(confirm('Are you sure you want to delete your account?')){
       $('#deleteAccount').append("<input type='hidden' name='delete' value='"+
                         true+"' />");
      this.submit();
  }
});