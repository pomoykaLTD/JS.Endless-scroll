class tabView{
    id;
    view;
    tbody;
    static MAX_ITEMS=100; //максимальное кол-во записей в таблице
    static SCROLL_ITEMS=4; //число прокручиваемых строк за раз
    static SCROLL_OFFSET=10; //смещение скролла для бесконечной прокрутки
    _cash=new Array; //должно быть #XXX - приватное поле, но нет поддержки mozilla. (_XXX - защищенное поле)
    _preScrollTop=0; // для определения направление
    _preDirection; // для определения смены направления
    _scroll=(e)=>{
        if(Math.abs(this._preScrollTop-this.tbody.scrollTop)<5) return; // некоторое допущение смещения скролла

        let direction=this._preScrollTop<=this.tbody.scrollTop; // направление перелистывания
        if( direction!=this._preDirection ){ // при смене направления очищаем кещ
            this._cash=new Array;
            console.log('очищен кеш, смена направления');
        }

        //триггеры подгрузки данных
        if( direction && this.tbody.scrollHeight/this.tbody.scrollTop<1.3 && this._cash.length==0 ){
            //подгрузка данных в конец списка
            console.log('получение данных, прямое направление, scrollTop:'+this.tbody.scrollTop);
            this._cash=this.getData(Number(this.tbody.lastChild.id),direction);
        }else if( !direction && this.tbody.scrollHeight/this.tbody.scrollTop>10 && Number(this.tbody.firstChild.id)>1 && this._cash.length==0){
            //подгрузка данных в начало списка
            console.log('получение данных, обратное направление, scrollTop:'+this.tbody.scrollTop);
            this._cash=this.getData(Number(this.tbody.firstChild.id),direction);
        }

        //достижение конца списка
        if(direction && this._cash.length>0 && this.tbody.lastChild.getBoundingClientRect().top<this.tbody.getBoundingClientRect().bottom){
            console.log('вставка в конец, удаление в начале');
            this._cash.splice(0,Math.min(tabView.SCROLL_ITEMS,this._cash.length)).forEach( (rec, index, arr)=>{
                this.tbody.append(tabView._renderTr(rec)); //добавление строки в конец
                this.tbody.removeChild( this.tbody.firstChild ); //удаление строки в начале
            });

            this.tbody.scrollTop=this.tbody.scrollHeight-this.tbody.clientHeight-tabView.SCROLL_OFFSET; //позиция скролла вблизи конца
        }else
        //достижение начала списка
        if(!direction && this._cash.length>0 && this.tbody.scrollTop<5 ){ //this.tbody.scrollTop - должен быть 0, но не факт, потому допуск
            console.log('вставка в начало, удаление с конца');
            this._cash.splice(0,Math.min(tabView.SCROLL_ITEMS,this._cash.length)).forEach( (rec, index, arr)=>{
                this.tbody.prepend(tabView._renderTr(rec)); //добавление строки в начало
                this.tbody.removeChild( this.tbody.lastChild ); //удаление строки с конца
            });

            this.tbody.scrollTop=tabView.SCROLL_OFFSET; //позиция скролла вблизи начала
        }

        this._preScrollTop=this.tbody.scrollTop;
        this._preDirection=direction;
    };

    constructor(el,id) {
        this.view=el;
        this.tbody=document.createElement('tbody');
        this.id=id;
    }

    render(caption=''){
        this.setCaption(caption);
        for(let rec of this.getData()){
            this.tbody.append(tabView._renderTr(rec));
        }
        this.view.replaceChild(this.tbody,this.view.getElementsByTagName('tbody')[0]);

        //scrolling
        let preScrollTop=0;
        this.tbody.addEventListener('scroll',this._scroll);
    }

    /*
        n - номер текущей строки;
        direction (true - вперед, false - назад) - направление чтения данных
    */
    getData(n=0,direction=true){
        let arr=new Array;
        if(direction){
            for(let i=0;i<tabView.MAX_ITEMS;i++){
                arr[i]={
                    id:(n+1+i),
                    name:'name'+(n+1+i)
                }
            }
        }else if(n>1){
            for(let i=0;i<((tabView.MAX_ITEMS>n)?n-1:tabView.MAX_ITEMS);i++){
                arr[i]={
                    id:(n-1-i),
                    name:'name'+(n-1-i)
                }
            }
        }
        return arr
    }

    setCaption(caption='') {
        if(caption=='') return;
        let el=document.createElement('caption');
        el.append(document.createTextNode(caption));
        if(this.view.firstChild.tagName=='caption') this.view.replaceChild(el,this.view.firstChild)
        else this.view.prepend(el);
    }

    static _renderTr(rec){
        let tr=tabView._Tr(rec.id);
        tr.append(tabView._Td(tr,rec.id));
        tr.append(tabView._Td(tr,rec.name));
        return tr
    }
    static _Tr(id=''){
        let tr=document.createElement('tr');
        if(id) tr.id=id;
        return tr;
    }
    static _Td(tr,text){
        let td=document.createElement('td');
        if(text) td.append(document.createTextNode(text));
        tr.append(td);
        return td;
    }

}
