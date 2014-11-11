var rootUrl=$('#rooturl').val();
$(document).ready(function(e){
  // $("#results").html('');
      
	  
	   $('.shoppingcart--').on('click', function(e){
		 
		   $('.loader').fadeIn();
				load($(this).attr('href'));
				return false;
		});
	setTimeout(function(){
		//$('#button-cart').attr('class','btn btn-primary btn-lg btn-block');
		//alert('done');
	},3000);
	
	$('#button-cart--').on('click', function() {
		alert('here');
		 $("#results").html('');
		 var url=$('#rooturl').val()+'add.aspx?'+$("#frmProduct" ).serialize();
		$.get( url, function( data ) {
		 $('#Dialog1').html(data);
		 $('#DialogTrigger').click();
		});
	});
	
	
	
	$('#frmpayments').submit(function(e) {
		var count=0;
		$('#frmpayments .required').each(function() {
		 if ($(this).val() == ""){
			 count++;
		  }});

		if(count>0){
			alert('All fields are required.');
		}else{
           $('#btnpayment').click();
		}
	     return false;
		e.preventDefault();
       });
	$('#btnpayment').on('click',function(){
		 var url=$('#rooturl').val()+'cart.aspx?option=save&'+$("#frmcheckout" ).serialize()+'&'+$("#frmpayments" ).serialize();
		 $.get( url, function( data ) {
		   $('.btnthankyou').click();
		    $("#frmcheckout").trigger('reset');
		    $("#frmpayments").trigger('reset');
			$("#results").html('<p>Your cart is empty</p>');
		});
	});
	$('#frmRegister').submit(function(e) {
		var count=0;
		$('#frmRegister .required').each(function() {
		 if ($(this).val() == ""){
			 count++;
		  }});

		if(count>0){
			alert('All fields are required.');
		}else{
		
		$('.overlay').fadeIn();
        var url=$('#rooturl').val()+'cart.aspx?option=register&'+$("#frmRegister" ).serialize();
		$.get( url, function( data ) {
	     $('#top').show();
		 $('.overlay').fadeOut();
		 $('.home').click();
		});
		}
	     return false;
		e.preventDefault();
       });
	
	$('#frmcheckout').submit(function(e) {
		var count=0;
		$('#frmcheckout .required').each(function() {
		 if ($(this).val() == ""){
			 count++;
		  }});
  
		if(count>0){
			alert('All fields are required.');
		}else{
          $('#btnshipping').click();
		}
	     return false;
		e.preventDefault();
       });
	 
	

});
function load(url){	
	//$("#results").fadeOut(100);
	$('.overlay').show();
	//$('#productlist').fadeOut();
	$.ajax({
		crossOrigin: true,
		url: url,
		//dataType: "json", //no need. if you use crossOrigin, the dataType will be override with "json"
		//charset: 'ISO-8859-1', //use it to define the charset of the target url
		context: {},
		success: function(data){
		}
	}).done(function(data, textStatus, jqXHR){
		$("#results").html(data);		
		//$("#results").fadeIn(2000);
		//$('.productcont').hide();
		//setTimeout(function(){
			$('.overlay').fadeOut();
			$('.shoppingcartshow').click();
		//},500);
		
		
    });// done
	

	
}