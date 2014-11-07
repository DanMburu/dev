//var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });

var id = getUrlVars()["id"];

var db;


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	
    db = window.openDatabase("EmployeeDirectoryDB", "1.0", "PhoneGap Demo", 200000);
	console.log("database opened");
    
	db.transaction(getProduct, transaction_error);
	db.transaction(getProdDetails, transaction_error);
}

function transaction_error(tx, error) {
	$('#busy').hide();
    alert("Database Error: " + error);
}

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
	
	db = null;
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
	// alert(len);
	 
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
	
	db = null;
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
