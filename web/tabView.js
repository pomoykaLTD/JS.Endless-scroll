class tabView{
    view;
    tbody;
    id;
    isLoad=false; //флаг начала загрузки данных
    static MAX_ITEMS=100; //максимальное кол-во записей в таблице

    static Tr(id=''){
        let tr=document.createElement('tr');
        if(id) tr.id=id;
        return tr;
    }
    static Td(tr,text){
        let td=document.createElement('td');
        if(text) td.append(document.createTextNode(text));
        tr.append(td);
        return td;
    }

    constructor(el,id) {
        this.view=el;
        this.tbody=document.createElement('tbody');
        this.id=id;
    }

    render(caption=''){
        this.setData();
        this.view.replaceChild(this.tbody,this.view.getElementsByTagName('tbody')[0]);
        //this.setCaption(caption);

        //scrolling
        let curView=this;
        let preScrollTop=0;
        this.tbody.addEventListener('scroll',function(e){
//console.log('0. isLoad:'+curView.isLoad);
            if(curView.isLoad) return;

            let direction=preScrollTop<this.scrollTop; // направление перелистывания

            if( direction && (this.clientHeight+100)>(this.scrollHeight-this.scrollTop) ){
//console.log('1. direction:'+direction+' scrollTop:'+this.scrollTop);
                //this.parentNode - <table>
                curView.setData( Number(this.lastChild.id.substring(1)) , direction );
            }else if( !direction && this.scrollTop<100 ){
//console.log('2. direction:'+direction+' scrollTop:'+this.scrollTop);
                curView.setData( Number(this.firstChild.id.substring(1)) , direction );
//            }else{
//console.log('3. direction:'+direction+', scrollTop='+this.scrollTop+', clientHeight'+this.clientHeight+', scrollHeight'+this.scrollHeight);
            }
            preScrollTop=this.scrollTop;
        });

        //let txt=JSON.stringify(getData());
        //alert(txt);
    }

    /*
        n - идентификатор первой записи
        direction (true - вперед, false - назад) направление чтения данных
    */
    setData(n=0,direction=true){
        this.isLoad=true; //начало загрузки
        let data=this.getData(n,direction);
console.log('подгрузка direction:'+direction+', '+this.tbody.childNodes.length+'+'+data.length);
        for(let i=0;i<data.length;i++){

            let tr=tabView.Tr(data[i].id);
            tr.append(tabView.Td(tr,data[i].id));
            tr.append(tabView.Td(tr,data[i].name));

            if(direction){
                this.tbody.append(tr); //добавление строки в конец
                if(this.tbody.childNodes.length>tabView.MAX_ITEMS*2){
console.log('удаление с начала '+this.tbody.childNodes.length);
                    this.tbody.removeChild( this.tbody.firstChild ); //удаление строки в начале
                }
             }else{
                 this.tbody.prepend(tr); //добавление строки в начало
                 if(this.tbody.childNodes.length>tabView.MAX_ITEMS*2){
console.log('удаление с конца '+this.tbody.childNodes.length);
                     this.tbody.removeChild( this.tbody.lastChild ); //удаление строки в конце
                 }
            }

        }

        this.isLoad=false; //окончание загрузки
    }

    /*
        n - идентификатор первой записи
        direction (true - вперед, false - назад) направление чтения данных
    */
    getData(n=0,direction){
        let arr;
        if(direction){
            arr=new Array(tabView.MAX_ITEMS);
            for(let i=0;i<arr.length;i++){
                arr[i]={
                    id:'_'+(n+1+i),
                    name:'name'+(n+1+i)
                }
            }
        }else if(n>1){
            arr=new Array((tabView.MAX_ITEMS>n)?n-1:tabView.MAX_ITEMS);
            for(let i=0;i<arr.length;i++){
                arr[i]={
                    id:'_'+(n-1-i),
                    name:'name'+(n-1-i)
                }
            }
        }else arr=new Array;
        return arr
    }

    // setCaption(caption) {
    //     if (!caption) return;
    //     let el = (this.view.caption = '') ? document.createElement('caption') : this.view.childNodes[0];
    //     el.append(document.createTextNode(caption));
    //     this.view.prepend(el);
    // }
}
