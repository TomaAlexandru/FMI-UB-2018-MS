$(document).ready(function(){
	$.post(
		"memo_checkbox_bd.php",
		{
			get_checkboxes:true
		},
		function(data){
			data=data.trim();
			console.log(data);
			if(data=="eroare_logare")
				return;
			vect_ids=eval(data);
			for(var i=0;i<vect_ids.length;i++)
			{
				$("#"+vect_ids[i]+".memo_checkbox").prop("checked",true);
			}
		}
	);
	$(".memo_checkbox").on("change",function(){
		var $ch=$(this);
		$.post(
			"memo_checkbox_bd.php",
			{
				id:$(this).attr("id"),
				stare:$(this).prop("checked")?1:0
			},
			function(data){
				console.log(data);
				data=data.trim();
				if(data=="eroare_logare")
				{
					alert("trebuie sa fii logat pentru a bifa");
					$ch.prop("checked",false);
					if(actualizeaza_punctaj_barem)
						actualizeaza_punctaj_barem();
				}
			}
		);		
	})
});

/*functii folosite in pagina de introducere a notelor*/

function actualizeaza_punctaj(elem,punctaj_maxim){
	var nr_id_input=elem.id.substring(4);//sare peste primele 4 litere reprezentand cuvantul "nota"
	var input_punctaj=document.getElementById("pct"+nr_id_input);
	input_punctaj.value=parseFloat(elem.value)*punctaj_maxim/10;
}

function actualizeaza_nota(elem,punctaj_maxim){
	var nr_id_input=elem.id.substring(3);//sare peste primele 3 litere reprezentand cuvantul "pct"
	var input_nota=document.getElementById("nota"+nr_id_input);
	input_nota.value=parseFloat(elem.value)*10/punctaj_maxim;
}




function sterge_fis(folder_materie, upload_de_sters, id_ex,id_fis_afisat){
r=confirm("Chiar doriti sa stergeti fisierul?");
if(r)
	{
		if (window.XMLHttpRequest)
			{
			
			cerere=new XMLHttpRequest();
			}
		else
			{
			cerere=new ActiveXObject("Microsoft.XMLHTTP");
			}
		cerere.onreadystatechange=function(){
			if(cerere.readyState==4 && cerere.status==200){//dc totu e ok
				var rasp=cerere.responseText;
				if(rasp)
					{				
					//alert(rasp);
					
					if(rasp.indexOf('ok')>=0 || rasp.indexOf('eroare_fis_negasit')>=0)
						{
						afisaj_fisier=document.getElementById(id_fis_afisat);
						//alert(id_fis_afisat)
						parinte=afisaj_fisier.parentNode;
						//alert(parinte.innerHTML)
						//alert(afisaj_fisier.innerHTML);
						afisaj_fisier.innerHTML='';
						x=parinte.removeChild(afisaj_fisier);
						
						//x.innerHTML='';
						if (rasp=="ok")
							alert("Fisier sters cu succes.");
						else
							alert(rasp);
						}
					else
						if(rasp.indexOf('eroare')>=0)
							alert(rasp);
					}
				}
			}
		cerere.open("POST","sterge_upload.php",true);
		try
		{
		cerere.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		cerere.send("folder="+folder_materie+"&idfu="+upload_de_sters+"&id_ex="+id_ex);
		}
		catch(e)
		{
		alert("Eroare AJAX");
		}
	}//sfarsit if(r) - daca s-a dat ok la confirm
}



function selectText(btn)
{
	//var elem_sel=document.getElementById(id);
	var parent_elem, elem_sel;
	parent_elem=btn.parentNode;
	
	var ind=0;
	while(parent_elem.childNodes[ind]!=btn && ind<parent_elem.childNodes.length)
	ind++;
	
	do 
	{
		ind++; 
		elem_sel=parent_elem.childNodes[ind];
	} while (elem_sel && elem_sel.nodeType !== 1 && elem_sel.nodeName=="DIV");//1==ELEMENT_NODE
	if (document.selection) 
	{		
		document.selection.empty(); 		
		var range = document.body.createTextRange();
 	    range.moveToElementText(elem_sel);
		range.select();
	}
	else if (window.getSelection) 
	{
		window.getSelection().removeAllRanges();
		var range = document.createRange();
		range.selectNode(elem_sel);
		window.getSelection().addRange(range);
	}
}


function initial()
{
	if(typeof initial_specific == 'function') { 
	initial_specific(); 
	}
	if(typeof regleaza_latime_ecran == 'function')
		regleaza_latime_ecran();
	st_pag_menu();
	//unifyHeights();


	$("div.cod, code.cod").before("<hr class='despartitor'/><button type='button' class='selecteaza_textul' onclick=\"selectText(this)\">selecteaza textul</button>");
	marcheaza_cod();
	$(document).ready(function() {
		if(typeof unifyHeights == 'function')
			unifyHeights();
	});
	
}

function marcheaza_cod(){
	$("div.cod").each(function(i,val){
		if ($(this).hasClass("comm_c"))
        {
			var sir=$(this).html();
			$(this).html(parseaza_text_c(sir));
        }
		if ($(this).hasClass("comm_asp"))
        {
			var sir=$(this).html();
			$(this).html(parseaza_text_asp(sir));
        }
    });
}


function parseaza_text_c(sir)
{
	//caut comentarii pe mai multe randuri.
	var inceput_span="<span style='color:green;font-weight:bold'>";
	var lg_inc_span=inceput_span.length;
	var sfarsit_span="</span>";
	var lg_sf_span=sfarsit_span.length;
	var gata=0;
	var x1,x2;
	x2=0;

	while(!gata)
	{
		x1=sir.indexOf("/*",x2);
		x2=sir.indexOf("*/",x2);
		if(x1==-1 || x2==-1)
		{
			gata=1;
		}
		else
		{
			sir=sir.substring(0,x1)+inceput_span+sir.substring(x1,x2+2)+sfarsit_span+sir.substring(x2+2);
			var lg_com=x2-x1+2;
			x2+=lg_inc_span+2+lg_sf_span;
		}
	}
	var x2vechi=0;
	x2=0;
	gata=0;
	while(!gata)
	{
		x1=sir.indexOf("//",x2vechi);
		x2=sir.indexOf("<br>",x1);
		var lgx2=4;
		if(x2==-1) 
		{
			x2=sir.indexOf("<br/>",x2vechi);
			lgx2=5;
		}
		if(x1==-1)
		{
			gata=1;
		}
		else
		{
			if(x2==-1) 
				{
				x2=sir.length-1;
				lgx2=0;
				gata=1;
				}
			var siraux=sir.substring(0,x1)+inceput_span+sir.substring(x1,x2+lgx2)+sfarsit_span+sir.substring(x2+lgx2);
			//alert("x1="+x1+"x2="+x2+"siraux="+siraux);
			sir=siraux;
			var lg_com=x2-x1+lgx2;
			x2+=lg_inc_span+2+lg_sf_span;
		}
		x2vechi=x2;
	}
	//alert(sir);
	return sir;
}

function parseaza_text_asp(sir)
{

	//caut comentarii pe mai multe randuri.
	var inceput_span="<span style='color:green;font-weight:bold'>";
	var lg_inc_span=inceput_span.length;
	var sfarsit_span="</span>";
	var lg_sf_span=sfarsit_span.length;
	var gata=0;
	var x1,x2;
	x2=0;

	while(!gata)
	{
		x1=sir.indexOf("&lt;%--",x2);
		x2=sir.indexOf("--%&gt;",x2);
		
		var lgx2=7;
		if(x1==-1 || x2==-1)
		{
			gata=1;
		}
		else
		{
			sir=sir.substring(0,x1)+inceput_span+sir.substring(x1,x2+lgx2)+sfarsit_span+sir.substring(x2+lgx2);
			var lg_com=x2-x1+lgx2;
			x2+=lg_inc_span+lgx2+lg_sf_span;
		}
	}
	return sir;
}





