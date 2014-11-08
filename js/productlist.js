var db;
var dbCreated = false;
var id;
var uuid;
//var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {


    db = window.openDatabase("EmployeeDirectoryDB", "1.0", "PhoneGap Demo", 200000);
   // if (dbCreated){
   // 	db.transaction(getEmployees, transaction_error);
	//}
   // else
    db.transaction(populateDB, transaction_error, populateDB_success);
		
   // uuid=device.uuid;
   alert(device.uuid);
   uuid='645454';
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
	
	var sql = "select * from employee";
	tx.executeSql(sql, [], getEmployees_success);
}
function getEmployees_success(tx, results) {
	
	$('#busy').hide();
    var len = results.rows.length;
	$('#productlist').html('');
    for (var i=0; i<len; i++) {
    	var employee = results.rows.item(i);
		$('#productlist').append('<div class="product-layout product-list col-xs-12"><div class="product-thumb">'+
		'<div class="image"><a class="lnkProduct" data-transition="slide"  href="#page2" id="' + employee.id + '"><img src="img/' + employee.product_icon + '" alt="' + employee.product_name + '" title="' + employee.product_name + '" class="img-responsive"></a></div><div></div></div></div>');
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
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
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
	db.transaction(register, transaction_error);	
	
})  
});

function register(tx) {	
    tx.executeSql("INSERT INTO customer (registered) VALUES (1)");
}
function register_success(tx, results) {
	
}


function addToCart(tx) {
	$('#busy').show();
	var sql = 
		"CREATE TABLE IF NOT EXISTS cart ( "+
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"cat_id INTEGER, " +
		"product_name VARCHAR(2), " +
		"product_icon VARCHAR(2), " +
		"product_image VARCHAR(2), " +
		"product_desc VARCHAR(20))";
    tx.executeSql(sql);
    tx.executeSql("INSERT INTO employee (id,cat_id,product_name,product_icon,product_image,product_desc) VALUES (1,1,'Bells','bells.jpg','img-bell.png','<p>Up to 40 of the finest malt and grain whiskies are matured in oak casks before being skilfully blended to give Bell''s Blended Scotch Whisky its rich nose, warm taste and lingering finish.</p><p><strong>Variants:</strong> Bell''s Original, Bell''s Special Reserve (GB market only), and Bell''s Decanter which is produced each year. </p><p><strong>Fact:</strong> The now famous Bell''s Decanters are collectable. They were first produced in the 1930s and since 1988 a decanter has been produced each Christmas. </p>')");
    tx.executeSql("INSERT INTO employee (id,cat_id,product_name,product_icon,product_image,product_desc) VALUES (2,1,'Ciroc','Ciroc.jpg','the-ciroc.jpg','<p>Cîroc vodka is the world''s most sophisticated vodka. Made exclusively from top-quality Mauzac Blanc and Ugni Blanc grapes for an exquisitely smooth, fresh and innovative vodka experience. Cîroc vodka uses cold maceration, cold fermentation and cold storage and is distilled five times over.</p><p>Fact: Cîroc comes from a combination of two French words: cime, meaning peak and roche meaning rock. This evokes the Gaillac region which is one of the highest wine growing regions in France.</p> ')");
}
function populateDB(tx) {
	$('#busy').show();
		
	tx.executeSql('DROP TABLE IF EXISTS employee');
	var sql = 
		"CREATE TABLE IF NOT EXISTS employee ( "+
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"cat_id INTEGER, " +
		"product_name VARCHAR(2), " +
		"product_icon VARCHAR(2), " +
		"product_image VARCHAR(2), " +
		"product_desc VARCHAR(20))";
    tx.executeSql(sql);
    tx.executeSql("INSERT INTO employee (id,cat_id,product_name,product_icon,product_image,product_desc) VALUES (1,1,'Bells','bells.jpg','img-bell.png','<p>Up to 40 of the finest malt and grain whiskies are matured in oak casks before being skilfully blended to give Bell''s Blended Scotch Whisky its rich nose, warm taste and lingering finish.</p><p><strong>Variants:</strong> Bell''s Original, Bell''s Special Reserve (GB market only), and Bell''s Decanter which is produced each year. </p><p><strong>Fact:</strong> The now famous Bell''s Decanters are collectable. They were first produced in the 1930s and since 1988 a decanter has been produced each Christmas. </p>')");
    tx.executeSql("INSERT INTO employee (id,cat_id,product_name,product_icon,product_image,product_desc) VALUES (2,1,'Ciroc','Ciroc.jpg','the-ciroc.jpg','<p>Cîroc vodka is the world''s most sophisticated vodka. Made exclusively from top-quality Mauzac Blanc and Ugni Blanc grapes for an exquisitely smooth, fresh and innovative vodka experience. Cîroc vodka uses cold maceration, cold fermentation and cold storage and is distilled five times over.</p><p>Fact: Cîroc comes from a combination of two French words: cime, meaning peak and roche meaning rock. This evokes the Gaillac region which is one of the highest wine growing regions in France.</p> ')");
    tx.executeSql("INSERT INTO employee (id,cat_id,product_name,product_icon,product_image,product_desc) VALUES (3,1,'Johnnie Walker Blue','johnwarker.jpg','sample.jpg','<p>The world''s leading Scotch Whisky brand and most valuable premium spirit brand according to Impact Databank, Johnnie Walker Blended Scotch Whisky was one of the first truly global brands. In 1920, 100 years after origination, the brand was distributed in 120 countries. Today it is found in almost 200 countries. Six bottles of Johnnie Walker Blended Scotch Whisky are sold every second.</p><p><strong>Fact:</strong> Johnnie Walker Scotch Whisky has been winning international quality awards since 1879.</p>')");
    tx.executeSql("INSERT INTO employee (id,cat_id,product_name,product_icon,product_image,product_desc) VALUES (4,1,'The Singleton','singleton.jpg','the-singleton.jpg','<p>Smooth and rounded… as good an example of this style as I have ever tasted'' Charlie Maclean, author of Malt Whisky and leading whisky writer.</p><p><strong>Fact:</strong> Local barley is still malted and carefully dried at the distillery. The distlillery is the only one in Scotland malting its own barley using its own on-site Saladin and drum maltings.</p>')");

	tx.executeSql('DROP TABLE IF EXISTS product_details');
	var sql = 
		"CREATE TABLE IF NOT EXISTS product_details ( "+
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"prod_id INTEGER, " +
		"option_id INTEGER, " +
		"prod_capacity VARCHAR(2), " +
		"prod_price VARCHAR(20))";
    tx.executeSql(sql);
    tx.executeSql("INSERT INTO product_details (id,option_id,prod_id,prod_capacity,prod_price) VALUES (1,1,1,'500Ml','1000')");
	tx.executeSql("INSERT INTO product_details (id,option_id,prod_id,prod_capacity,prod_price) VALUES (2,2,1,'750Ml','120')");
	tx.executeSql("INSERT INTO product_details (id,option_id,prod_id,prod_capacity,prod_price) VALUES (3,3,1,'1 litres','2000')");

	tx.executeSql("INSERT INTO product_details (id,option_id,prod_id,prod_capacity,prod_price) VALUES (4,1,2,'500Ml','1000')");
	tx.executeSql("INSERT INTO product_details (id,option_id,prod_id,prod_capacity,prod_price) VALUES (5,2,2,'750Ml','1000')");


	tx.executeSql("INSERT INTO product_details (id,option_id,prod_id,prod_capacity,prod_price) VALUES (6,1,3,'500Ml','1000')");
	tx.executeSql("INSERT INTO product_details (id,option_id,prod_id,prod_capacity,prod_price) VALUES (7,2,3,'750Ml','1000')");
	tx.executeSql("INSERT INTO product_details (id,option_id,prod_id,prod_capacity,prod_price) VALUES (8,3,3,'1 Litres','1000')");
 

}


// PROSDUCT DETAILS
function getProduct(tx) {
	$('#busy').show();		
	var sql = "select * from employee where id=:id ";
	tx.executeSql(sql, [id], getProduct_success);
}
function getProduct_success(tx, results) {
	$('#busy').hide();
	var employee = results.rows.item(0);
	$('#tab-description').html(employee.product_desc);
	$('#prodname').html(employee.product_name);
	$('#product_id').val(employee.id);
	
	$('#thumb').attr('src','img/'+employee.product_image);
	
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
				'<input name="option_id" value="'+prod.id+'" type="radio">'+prod.prod_capacity+' <br>'+prod.prod_price+''+ 
			'</label>'+
		'</div>'
		);
    }
	
}