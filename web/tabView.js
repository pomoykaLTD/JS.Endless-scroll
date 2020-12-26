class tabView{
    constructor(el,id,caption) {
        this.tabl=el;
        this.tbody=document.createElement('tbody');
        this.id=id;
        this.caption=caption;
    }

    render(){
        setData(tbody);
        tabl.replaceChild(tbody,tabl.getElementsByTagName('tbody')[0]);
    }
}


function render(tabl) {
    let tbody=document.createElement('tbody');
    setData(tbody);
    tabl.replaceChild(tbody,tabl.getElementsByTagName('tbody')[0]);

    //scrolling
    tbody.addEventListener('scroll',function(e){
        document.getElementById('qwe').innerText=this.scrollHeight-this.scrollTop;
        if( tbody.getAttribute() && this.clientHeight-(this.scrollHeight-this.scrollTop)<100){
            //this.parentNode
            setData(this, Number(this.lastChild.id.substring(1)) );
        }
    });

    //let txt=JSON.stringify(getData());
    //alert(txt);

}

function setData(tbody,n=0){
    let data=getData(n);
    for(let i=0;i<data.length;i++){
        let tr=document.createElement('tr');
        tr.id=data[i].id;

        let td=document.createElement('td');
        td.append(document.createTextNode(data[i].id));
        tr.append(td);

        td=document.createElement('td');
        td.append(document.createTextNode(data[i].name));
        tr.append(td);

        tbody.append(tr);
    }
}

function getData(n=0){
    let arr=new Array(100);
    for(let i=0;i<arr.length;i++){
        arr[i]={
            id:'_'+(n+i),
            name:'name'+(n+i)
        }
    }
    return arr
}
