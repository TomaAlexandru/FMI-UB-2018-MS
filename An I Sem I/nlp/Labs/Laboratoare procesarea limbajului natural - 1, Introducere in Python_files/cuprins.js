$(document).ready(function(){
	var nav_cuprins=document.querySelector("nav#cuprins");
	var hed=document.createElement("h3");
	hed.innerHTML="Cuprins";
	nav_cuprins.appendChild(hed);
	
	ol_initial=document.createElement("ol");
	//ol_initial.style.listStyleType="none";
	
	var elem=calculeaza_cuprins(document.body,"",ol_initial);
	
	if(elem)
	{
		nav_cuprins.appendChild(ol_initial);
		//document.body.appendChild(nav_cuprins,document.body.querySelectorAll("p.subtitlu")[0].nextSibling);
	}
});

function replaceAll(chrCautat,chrInloc,sir)
{
	var sir_nou="";
	for(var i=0;i<sir.length;i++)
		if(sir[i]==chrCautat)
			sir_nou+=chrInloc;
		else
			sir_nou+=sir[i];
	return sir_nou;
}

function calculeaza_cuprins(elem,prefix,ol_parinte){
	if(!elem || !ol_parinte)
		return;
	var lista_cuprins;
	var v_sectiuni=new Array()
	var gasit_sectiune=false;
	for(var i=0;i<elem.children.length;i++)
	{
		var stil=window.getComputedStyle(elem.children[i]);
		if(stil.display=="block")
			v_sectiuni.push(elem.children[i]);

	}


	for(var i=0;i<v_sectiuni.length;i++)
	{
		if(v_sectiuni[i].nodeName=="SECTION")
		{
			
			var li=document.createElement("li");
			var a=document.createElement("a");
			//var prefix_nou=prefix+(i+1)+".";
			var prefix_nou="";
			
			var text_titlu="fara_titlu";
			
			var titlu=v_sectiuni[i].querySelectorAll("h1,h2,h3,h4,h5,h6")[0];
			if(titlu) 
			{
				text_titlu=titlu.textContent
				text_titlu= replaceAll("<","&lt;",text_titlu);
				text_titlu= replaceAll(">","&gt;",text_titlu);				
				var titlu_aux= replaceAll(" ","_",text_titlu);
				titlu_aux= replaceAll(".","",titlu_aux);
				v_sectiuni[i].id=titlu_aux;
				a.href="#"+titlu_aux;
			}
			a.innerHTML=prefix_nou+" "+text_titlu;
			
			li.appendChild(a);
			ol_parinte.appendChild(li);
			lista_cuprins=document.createElement("ol");
			lista_cuprins.style.listStyleType="none";
			calculeaza_cuprins(v_sectiuni[i],prefix_nou, lista_cuprins);
		}
		else 
		{
			calculeaza_cuprins(v_sectiuni[i],prefix, ol_parinte);
		}		
		
	}
	return true;
	
	
	
}	