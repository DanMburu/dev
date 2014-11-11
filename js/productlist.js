var db;
var dbCreated = false;
var id;
var uuid;
var value;
//var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {


    db = window.openDatabase("productsDirectoryDB", "1.0", "PhoneGap Demo", 200000);
   // if (dbCreated){
   // 	db.transaction(getproductss, transaction_error);
	//}
   // else
    db.transaction(populateDB, transaction_error, populateDB_success);
		
    uuid=device.uuid;
   //alert(device.uuid);
  // uuid='645454';
	$('.shoppingcart').attr('href',$('#rooturl').val()+'cart.aspx?cust_id='+uuid);
	$('.cust_id').val(uuid);
}
 
   
function transaction_error(tx, error) {
    alert("Database Error: " + error);
}

function populateDB_success() {
	
	dbCreated = true;
	db.transaction(checkRegistration, registration_error);	
    db.transaction(getProducts, transaction_error);	
	
}

function getProducts(tx) {

	var sql = "select * from products";
	
	tx.executeSql(sql, [], getproducts_success);
}
function getproducts_success(tx, results) {
	
	$('#busy').hide();
    var len = results.rows.length;
	$('#productlist').html('');
	
    for (var i=0; i<len; i++) {
    	var products = results.rows.item(i);
		$('#productlist').append('<div class="product-layout product-list col-xs-12"><div class="product-thumb">'+
		'<div class="image"><a class="lnkProduct" data-transition="slide"  href="#page2" id="' + products.pid + '"><img src="img/' + products.product_icon + '" alt="' + products.product_name + '" title="' + products.product_name + '" class="img-responsive"></a></div><div></div></div></div>');
    }
 $('.lnkProduct').on('click', function(e){
	 id=$(this).attr('id');
	 db.transaction(getProduct, transaction_error);
	 db.transaction(getProdDetails, transaction_error);
			
 });	
 
}

function checkRegistration(tx) {
	//tx.executeSql('DROP TABLE IF EXISTS customer');
	var sql = 
		"CREATE TABLE IF NOT EXISTS customer ( "+
		"cid INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"registered INTEGER(20))";
	   tx.executeSql(sql);	
       
	   var sql = "select * from customer where id=:id ";
	   tx.executeSql(sql, [1], check_success);
	  //tx.executeSql(sql, check_success);
	
	
	
}
function registration_error(tx, error) {
    alert("Database Error: " + error);
}

function check_success(tx, results) {
	 var len = results.rows.length;
	 if(len==0){
		$('#top').hide();
		$('.lnkgateway').click(); 
	 }else{
		 $('#top').slideDown();
		  //$('#page').slideDown(5000);
	 }
}
$(document).ready(function(e) {
    $('#frmRegister').submit(function(e) {
	db.transaction(register, transaction_error)
	}) // Register
	
	$('#button-cart').on('click', function() {
		db.transaction(addtocart, transaction_error);
	}); //button-cart
	
	$('.shoppingcart').click(function( event ) {
		event.preventDefault();
		db.transaction(getCart, transaction_error);
	});//shoppingcart
	
	
});
function addtocart(tx) {
	//tx.executeSql('DROP TABLE IF EXISTS tbl_cart');	
    	var sql = 
		"CREATE TABLE IF NOT EXISTS tbl_cart ( "+
		"cid INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"product_id INTEGER, " +
		"option_id INTEGER, " +
		"quantity INTEGER)";
    tx.executeSql(sql);
	var qty=$('#input-quantity').val();
	var prodId=$('#product_id').val();
	var option_id=$('input[name="option_id"]:checked').val();
   
	//alert(sql);
	
	db.transaction(function(transaction) {
            // Define insert query
			sql = "INSERT INTO tbl_cart (product_id,option_id,quantity) VALUES (?,?,?)";					
            transaction.executeSql(sql, [prodId,option_id,qty]
                , function(tx, result) {   // On success
                     console.log('Business data inserted successfully.');
					 $('#Dialog1').html('Product added to cart.');
		             $('#DialogTrigger').click();
                },
                function(error){     // On error                              
                     console.log('Error occurred while inserting business data.');
                });
        });
   
}

function getCart(tx) {
	db.transaction(function(transaction) {
		        //$("#results").html('');
		        //$("#results").fadeOut();
				db.transaction(function(transaction) {
							transaction.executeSql("select * from tbl_cart", [],
							function(tx, result) {
								 var len = result.rows.length;
								 var cartItems='';
								  for (var i=0; i<len; i++) {
									  var prod = result.rows.item(i);
								       console.log(prod);
								  }
				});
				});
                transaction.executeSql("select * from tbl_cart as c inner join products p on c.product_id=p.product_id inner join product_details pd on pd.option_id=c.option_id and pd.prod_id=p.product_id", [],
				function(tx, result) {
                      var len = result.rows.length;
                       //console.log(dataLength);
                      if(len  > 0){
						 	var data="<table class='table table-bordered'><tr><th>Product Name</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>";
							var total=0;
							var count=0;
                             //alert(len);
						  	for (var i=0; i<len; i++) {
								var prod = result.rows.item(i);
								//console.log(prod);
								data += "<tr><td>" + prod.product_name + "<br><small>Size: " + prod.prod_capacity + "</small></td> <td><input data-role='none' class='formcontrol' type='text' value='" + prod.quantity + "' name='option'" + prod.cid + " /> ";
								data += "<span class='input-group-btn'><button rel='" + prod.cid + "'  class='btnupdate btn btn-primary' title='Update' data-toggle='tooltip' type='button'><i class='fa fa-refresh'></i></button>";
								data += "<button  rel='" + prod.cid + "' class='btndelete btn btn-danger' title='Remove' data-toggle='tooltip' type='button'><i class='fa fa-times-circle'></i></button></span>";
								data += "</td> <td>" + prod.prod_price + "</td> <td>" + parseFloat(prod.prod_price) * parseFloat(prod.quantity) + "</td></tr>";
								count++;
								total += parseFloat(prod.prod_price) * parseFloat(prod.quantity);
							}//END FOR
							data += "<tr><td></td><td></td><td><strong>Total</strong></td><td><strong>Ksh "+total+"</strong></td></tr></table>";
							data += "<div class='pull-right'><a  href='#' class='btn btn-primary lnkcheckout'>Checkout t</a>";
                            $('.amountdue').text('Ksh ' +total);
					   }else{
                              data = "<p>Your cart is empty</p>";
                       }
					   
					   $("#results").html("<div class='shoppingcartcont col-sm-8'>"+data+"</div>");		
						$('.overlay').fadeOut();
						//REGISTER BUTTON EVENTS
						$('.btndelete').on('click', function (e) {
							 if (confirm('Remove product from cart?')) {
							   id = $(this).attr('rel');
							   db.transaction(deleteFromCart, transaction_error);
							 }
							 
						 });//btndelete
						 $('.btnupdate').on('click', function (e) {
							id = $(this).attr('rel');
							value = $(this).parent().parent().find('.formcontrol').val();
							db.transaction(updateCart, transaction_error);
						 });//.btnupdate
						// END BUTTON EVENTS
						
						$('.lnkcheckout').on('click', function (e) {
							$('.overlay').fadeIn();
							db.transaction(function(transaction) {
							transaction.executeSql("select * from tbl_cart", [],
							function(tx, result) {
								 var len = result.rows.length;
								 var cartItems='';
								  for (var i=0; i<len; i++) {
    	                            var prod = result.rows.item(i);
									if(i==0)
									cartItems+=prod.product_id+','+prod.option_id+','+prod.quantity;
									else
		                            cartItems+=':'+prod.product_id+','+prod.option_id+','+prod.quantity;
								  }
								 //SEND TO THE SERVER
							 var url=$('#rooturl').val()+'add.aspx?option=cartitems&items='+cartItems+'&cust_id='+$('.cust_id').val();
							 console.log(url);
							 
								$.get( url, function( data ) {
									$('body').append(data);
									// EMPTY THE CART
									//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
									db.transaction(
									function(transaction) {
									// Define delete query
									var executeQuery = "Delete FROM tbl_cart";
									transaction.executeSql(executeQuery, []
										, function(tx, result) {  //On Success 
										  $('#lnkcheckout').click();
								          $('.overlay').fadeOut();
										});
								     });
								     //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
									
								});
		
		
							},
							function(error){     // On error                              
								 alert('Error occurred while deleting the business data.');
							});	
											
							});//transaction.executeSql				
							
							
						 });//.btnupdate
						// END BUTTON EVENTS
						
						
						$('.shoppingcartshow').click();
					   $("#results").fadeIn();
                  },
                  function(error) {
                        console.log("Error occurred while getting the data.");
                  });
          }); 
	
}




function updateCart(tx) {
	var sql="update tbl_cart set quantity=? where cid=?";
	$('#Dialog1').html('Your cart has been updated.');
	$('#DialogTrigger').click();
	tx.executeSql(sql, [value,id], updateCart_success);
} 
function deleteFromCart(tx) {	
	db.transaction(
		function(transaction) {
		// Define delete query
		var executeQuery = "Delete FROM tbl_cart where cid=?";
		transaction.executeSql(executeQuery, [id]
			, function(tx, result) {   // On success
			     updateCart_success(tx);
				 //alert('All business data deleted successfully.');
			},
			function(error){     // On error                              
				 alert('Error occurred while deleting the business data.');
			});
	});
	
	/*//var sql="delete from cart where id=:id";
	var sql="delete from cart where id="+id;
	alert(sql);
	tx.executeSql(sql, [], updateCart_success);
	
	*/
} 
function updateCart_success(tx) {
	db.transaction(getCart, transaction_error);
} 
function register(tx) {	
    tx.executeSql("INSERT INTO customer (registered) VALUES (1)");
}
function register_success(tx, results) {
	
}

function populateDB(tx) {
	$('#busy').show();
		
	tx.executeSql('DROP TABLE IF EXISTS products');
	var sql = 
		"CREATE TABLE IF NOT EXISTS products ( "+
		"pid INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"product_id INTEGER, " +
		"cat_id INTEGER, " +
		"product_name VARCHAR(50), " +
		"product_icon VARCHAR(50), " +
		"product_image VARCHAR(50), " +
		"product_desc VARCHAR(20))";
    tx.executeSql(sql);
	console.log(sql);
    tx.executeSql("INSERT INTO products (product_id,cat_id,product_name,product_icon,product_image,product_desc) VALUES (1,1,'Bells','bells.jpg','img-bell.png','<p>Up to 40 of the finest malt and grain whiskies are matured in oak casks before being skilfully blended to give Bell''s Blended Scotch Whisky its rich nose, warm taste and lingering finish.</p><p><strong>Variants:</strong> Bell''s Original, Bell''s Special Reserve (GB market only), and Bell''s Decanter which is produced each year. </p><p><strong>Fact:</strong> The now famous Bell''s Decanters are collectable. They were first produced in the 1930s and since 1988 a decanter has been produced each Christmas. </p>')");
    tx.executeSql("INSERT INTO products (product_id,cat_id,product_name,product_icon,product_image,product_desc) VALUES (2,1,'Ciroc','Ciroc.jpg','the-ciroc.jpg','<p>Cîroc vodka is the world''s most sophisticated vodka. Made exclusively from top-quality Mauzac Blanc and Ugni Blanc grapes for an exquisitely smooth, fresh and innovative vodka experience. Cîroc vodka uses cold maceration, cold fermentation and cold storage and is distilled five times over.</p><p>Fact: Cîroc comes from a combination of two French words: cime, meaning peak and roche meaning rock. This evokes the Gaillac region which is one of the highest wine growing regions in France.</p> ')");
    tx.executeSql("INSERT INTO products (product_id,cat_id,product_name,product_icon,product_image,product_desc) VALUES (3,1,'Johnnie Walker Blue','johnwarker.jpg','sample.jpg','<p>The world''s leading Scotch Whisky brand and most valuable premium spirit brand according to Impact Databank, Johnnie Walker Blended Scotch Whisky was one of the first truly global brands. In 1920, 100 years after origination, the brand was distributed in 120 countries. Today it is found in almost 200 countries. Six bottles of Johnnie Walker Blended Scotch Whisky are sold every second.</p><p><strong>Fact:</strong> Johnnie Walker Scotch Whisky has been winning international quality awards since 1879.</p>')");
    tx.executeSql("INSERT INTO products (product_id,cat_id,product_name,product_icon,product_image,product_desc) VALUES (4,1,'The Singleton','singleton.jpg','the-singleton.jpg','<p>Smooth and rounded… as good an example of this style as I have ever tasted'' Charlie Maclean, author of Malt Whisky and leading whisky writer.</p><p><strong>Fact:</strong> Local barley is still malted and carefully dried at the distillery. The distlillery is the only one in Scotland malting its own barley using its own on-site Saladin and drum maltings.</p>')");
console.log(sql);
	tx.executeSql('DROP TABLE IF EXISTS product_details');
	var sql = 
		"CREATE TABLE IF NOT EXISTS product_details ( "+
		"did INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"prod_id INTEGER, " +
		"option_id INTEGER, " +
		"prod_capacity VARCHAR(20), " +
		"prod_price VARCHAR(50))";
    tx.executeSql(sql);
    tx.executeSql("INSERT INTO product_details (option_id,prod_id,prod_capacity,prod_price) VALUES (1,1,'500Ml','1000')");
	tx.executeSql("INSERT INTO product_details (option_id,prod_id,prod_capacity,prod_price) VALUES (2,1,'750Ml','120')");
	tx.executeSql("INSERT INTO product_details (option_id,prod_id,prod_capacity,prod_price) VALUES (3,1,'1 litres','2000')");

	tx.executeSql("INSERT INTO product_details (option_id,prod_id,prod_capacity,prod_price) VALUES (1,2,'500Ml','1000')");
	tx.executeSql("INSERT INTO product_details (option_id,prod_id,prod_capacity,prod_price) VALUES (2,2,'750Ml','1000')");


	tx.executeSql("INSERT INTO product_details (option_id,prod_id,prod_capacity,prod_price) VALUES (1,3,'500Ml','1000')");
	tx.executeSql("INSERT INTO product_details (option_id,prod_id,prod_capacity,prod_price) VALUES (2,3,'750Ml','1000')");
	tx.executeSql("INSERT INTO product_details (option_id,prod_id,prod_capacity,prod_price) VALUES (3,3,'1 Litres','1000')");
	
    tx.executeSql("INSERT INTO product_details (option_id,prod_id,prod_capacity,prod_price) VALUES (1,4,'500Ml','1000')");
	tx.executeSql("INSERT INTO product_details (option_id,prod_id,prod_capacity,prod_price) VALUES (2,4,'750Ml','1000')");
	tx.executeSql("INSERT INTO product_details (option_id,prod_id,prod_capacity,prod_price) VALUES (3,4,'1 Litres','1000')");

 

}


// PROSDUCT DETAILS
function getProduct(tx) {
	$('#busy').show();		
	var sql = "select * from products where pid=? ";
	tx.executeSql(sql, [id], getProduct_success);
}
function getProduct_success(tx, results) {
	$('#busy').hide();
	
	var products = results.rows.item(0);
	$('#tab-description').html(products.product_desc);
	$('#prodname').html(products.product_name);
	$('#product_id').val(products.pid);
	
	$('#thumb').attr('src','img/'+products.product_image);
	
}

//Get pricing options
function getProdDetails(tx) {
	$('#busy').show();
	var sql = "select * from product_details where prod_id=:id ";
	tx.executeSql(sql, [id], getProdDetails_success);
}
function getProdDetails_success(tx, results) {
	$('#busy').hide();
	 var len = results.rows.length;
	 $('#input-options').html('');
	 
    for (var i=0; i<len; i++) {
    	var prod = results.rows.item(i);
		$('#input-options').append(
		'<div class="radio">'+
			'<label>'+
				'<input name="option_id" value="'+prod.option_id+'" type="radio">'+prod.prod_capacity+' <br>'+prod.prod_price+''+ 
			'</label>'+
		'</div>'
		);
    }
	//$('input:radio:first-child').attr('checked',true);
	 $("input:radio:not(:disabled):first-child").attr("checked", true);
}