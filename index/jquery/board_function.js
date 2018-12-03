function click2(x){
    $.ajax({
            url: '/list/'+x,
            type: 'get',
            data: {amount : $('#pagingNumber').val(),category:$('#catagoryValue').val()},
            success: function(result){
                $('.found').remove();
                var table ='';
                for(var i=0;i<result.data.length;i++){
                        table += '<tr class="found"><td><input name="ckbox" type="checkbox" value="'+result.data[i].number+'"/></td><td>'+result.data[i].number+'</td><td><a href="#" onclick="selectBoard('+result.data[i].number+')">'+result.data[i].title+'</a></td><td>'+result.data[i].writer+'</td><td>'+result.data[i].date+'</td><td>'+result.data[i].count+'</td></tr>';
                    }
                    $('.csvBoardBody table tr:first').after(table);
               
                var button = '';
                var buttonAmount = result.data.length/result.amount;
                if(result.data.length % result.amount > 0){
                    buttonAmount = parseInt(buttonAmount) + 1 ;
                }else{
                    buttonAmount = parseInt(result.data.length/result.amount);
                }
                for(var i=1; i<=buttonAmount; i++){
                    button += '<button onclick="click2('+i+')" value="'+i+'">'+i+'</button>';
                }
                   
                $('#paging').append(button);

            }
        });
   }
   function buttonAmount(x,y){
        buttonAmount = x/y;
        if(x % y > 0){
            buttonAmount = parseInt(buttonAmount) + 1 ;
        
        }else{
            buttonAmount = parseInt(x/y);
        
        }
        if( buttonAmount % 5 > 0){
            totalPage = parseInt(buttonAmount / 5) + 1 ;
        }else{
            totalPage = parseInt(buttonAmount / 5);
        }

   }
   
    function selectBoard(x){
        $.ajax({
            url: '/select',
            type: 'get',
            data: {category:$('#catagoryValue').val()},
            success: function(){
                $('.body #filecontents').load('/select/'+x);
            }
        });
       
    }

    function listAmount(){
          $.ajax({ 
             url: '/list',
             type: 'get',
             data: {amount : $('#pagingNumber').val(),category:$('#catagoryValue').val()},
             success: function(result){
                $('.found').remove();
                $('#paging').text('');
                var table ='';
                var button = '<button onclick="prev()"><</button>';
                buttonAmount = result.data.length/result.amount;
                if(result.data.length % result.amount > 0){
                    buttonAmount = parseInt(buttonAmount) + 1 ;
                   
                }else{
                    buttonAmount = parseInt(result.data.length/result.amount);
                   
                }

                if( buttonAmount % 5 > 0){
                    totalPage = parseInt(buttonAmount / 5) + 1 ;
                }else{
                    totalPage = parseInt(buttonAmount / 5);
                }

                if(totalPage <= 1){
                    for(var i=1; i<=buttonAmount; i++){
                        button += '<button onclick="click2('+i+')" value="'+i+'">'+i+'</button>';
                    }
                }else{
                    for(var i=1; i<=5; i++){
                        button += '<button onclick="click2('+i+')" value="'+i+'">'+i+'</button>';
                    }

                }
                button += '<button onclick="next()">></button>';  
                $('#paging').append(button);




                if(result.data.length < result.amount){
                    for(var i=0;i<result.data.length;i++){
                        table += '<tr class="found"><td><input name="ckbox" type="checkbox" value="'+result.data[i].number+'"/></td><td>'+result.data[i].number+'</td><td><a href="#" onclick="selectBoard('+result.data[i].number+')">'+result.data[i].title+'</a></td><td>'+result.data[i].writer+'</td><td>'+result.data[i].date+'</td><td>'+result.data[i].count+'</td></tr>';
                    }
                }else{
                    for(var i=0;i<result.amount;i++){
                        table += '<tr class="found"><td><input name="ckbox" type="checkbox" value="'+result.data[i].number+'"/></td><td>'+result.data[i].number+'</td><td><a href="#" onclick="selectBoard('+result.data[i].number+')">'+result.data[i].title+'</a></td><td>'+result.data[i].writer+'</td><td>'+result.data[i].date+'</td><td>'+result.data[i].count+'</td></tr>';
                    }
                }
                $('.csvBoardBody table tr:first').after(table);
                nowPage=1;

             }
         });    
    }
    
    function deleteBoard(){
        var ckboxArray = new Array;
        $('input:checkbox[name="ckbox"]:checked').each(function(){
            ckboxArray.push($(this).val());
        });
        $.ajax({ 
             url: '/delete',
             type: 'get',
             data: {ckboxamount :ckboxArray,category:$('#catagoryValue').val(),amount : $('#pagingNumber').val()},
             success: function(result){
                alert('삭제되었습니다');
                $('.found').remove();
                $('#paging').text('');
                var table ='';
                var button = '<button onclick="prev()"><</button>';
                buttonAmount = result.data.length/result.amount;

                if(result.data.length % result.amount > 0){
                    buttonAmount = parseInt(buttonAmount) + 1 ;
                }else{
                    buttonAmount = parseInt(result.data.length/result.amount);
                }
                if( buttonAmount % result.amount > 0){
                    totalPage = parseInt(buttonAmount / result.amount) + 1 ;
                }else{
                    totalPage = parseInt(buttonAmount / result.amount);
                }
                
                if(totalPage <= 1){
                    for(var i=1; i<=buttonAmount; i++){
                        button += '<button onclick="click2('+i+')" value="'+i+'">'+i+'</button>';
                    }           
                }else{
                    for(var i=1; i<=5; i++){
                        button += '<button onclick="click2('+i+')" value="'+i+'">'+i+'</button>';
                    }

                }
                button += '<button onclick="next()">></button>';  
                $('#paging').append(button);




                if(result.data.length < result.amount){
                    for(var i=0;i<result.data.length;i++){
                        table += '<tr class="found"><td><input name="ckbox" type="checkbox" value="'+result.data[i].number+'"/></td><td>'+result.data[i].number+'</td><td><a href="#" onclick="selectBoard('+result.data[i].number+')">'+result.data[i].title+'</a></td><td>'+result.data[i].writer+'</td><td>'+result.data[i].date+'</td><td>'+result.data[i].count+'</td></tr>';
                    }
                }else{
                    for(var i=0;i<result.amount;i++){
                        table += '<tr class="found"><td><input name="ckbox" type="checkbox" value="'+result.data[i].number+'"/></td><td>'+result.data[i].number+'</td><td><a href="#" onclick="selectBoard('+result.data[i].number+')">'+result.data[i].title+'</a></td><td>'+result.data[i].writer+'</td><td>'+result.data[i].date+'</td><td>'+result.data[i].count+'</td></tr>';
                    }
                }
                $('.csvBoardBody table tr:first').after(table);
                nowPage=1;
             }
        });
    }
    function searchBorad(){
        $.ajax({
            url: '/search',
            type: 'get',
            data: {search : $('#searchText').val(),amount:$('#pagingNumber').val(),category:$('#catagoryValue').val()},
            success: function(result){
                $('.found').remove();
                $('#paging').text('');
                var table ='';
                var button = '<button onclick="prev()"><</button>';
                var buttonAmount2 = result.data.length/result.amount;
                var totalPage2 =0;
                if(result.data.length % result.amount > 0){
                    buttonAmount2 = parseInt(buttonAmount2) + 1 ;
                
                }else{
                    buttonAmount2 = parseInt(result.data.length/result.amount);
                
                }
                if( buttonAmount2 % result.amount > 0){
                    totalPage2 = parseInt(buttonAmount2 / 5) + 1 ;
                }else{
                    totalPage2 = parseInt(buttonAmount2 / 5);
                }

                if(totalPage2 <= 1){     
                    for(var i=1; i<=buttonAmount2; i++){
                        button += '<button onclick="click2('+i+')" value="'+i+'">'+i+'</button>';
                    }
                }else{
                    for(var i=1; i<=5; i++){
                        button += '<button onclick="click2('+i+')" value="'+i+'">'+i+'</button>';
                    }

                }
                button += '<button onclick="next()">></button>';  
                $('#paging').append(button);




                if(result.data.length < result.amount){
                    for(var i=0;i<result.data.length;i++){
                        table += '<tr class="found"><td><input name="ckbox" type="checkbox" value="'+result.data[i].number+'"/></td><td>'+result.data[i].number+'</td><td><a href="#" onclick="selectBoard('+result.data[i].number+')">'+result.data[i].title+'</a></td><td>'+result.data[i].writer+'</td><td>'+result.data[i].date+'</td><td>'+result.data[i].count+'</td></tr>';
                    }
                }else{
                    for(var i=0;i<result.amount;i++){
                        table += '<tr class="found"><td><input name="ckbox" type="checkbox" value="'+result.data[i].number+'"/></td><td>'+result.data[i].number+'</td><td><a href="#" onclick="selectBoard('+result.data[i].number+')">'+result.data[i].title+'</a></td><td>'+result.data[i].writer+'</td><td>'+result.data[i].date+'</td><td>'+result.data[i].count+'</td></tr>';
                    }
                }
                $('.csvBoardBody table tr:first').after(table);

                
            }
        });
    }
   
    function prev(){
        nowPage = nowPage - 1;
        
        if(nowPage == 0){
            alert('처음 페이지입니다');
            nowPage = 1;
        }else{
            $.ajax({
                url:'/block/'+nowPage,
                type: 'get',
                data: {amount : $('#pagingNumber').val(),category:$('#catagoryValue').val()},
                success: function(result){
                        $('.found').remove();
                        $('#paging').text('');
                        var pageNumber = (parseInt(nowPage)-1)*5+1;
                        var table ='';
                        var button = '<button onclick="prev()"><</button>';
                        if(pageNumber + 4 >= buttonAmount){
                            for(var i= pageNumber; i<=buttonAmount; i++){
                                
                                button += '<button onclick="click2('+i+')" value="'+i+'">'+i+'</button>';
                            }
                        }else{
                            for(var i= pageNumber; i <= pageNumber+4; i++){
                                
                                button += '<button onclick="click2('+i+')" value="'+i+'">'+i+'</button>';
                            }
                        }
                        button += '<button onclick="next()">></button>';  
                                    $('#paging').append(button);

                        if(result.data.length < result.amount){
                            for(var i=0;i<result.data.length;i++){
                                table += '<tr class="found"><td><input name="ckbox" type="checkbox" value="'+result.data[i].number+'"/></td><td>'+result.data[i].number+'</td><td><a href="#" onclick="selectBoard('+result.data[i].number+')">'+result.data[i].title+'</a></td><td>'+result.data[i].writer+'</td><td>'+result.data[i].date+'</td><td>'+result.data[i].count+'</td></tr>';
                            }
                        }else{
                            for(var i=0;i<result.amount;i++){
                                table += '<tr class="found"><td><input name="ckbox" type="checkbox" value="'+result.data[i].number+'"/></td><td>'+result.data[i].number+'</td><td><a href="#" onclick="selectBoard('+result.data[i].number+')">'+result.data[i].title+'</a></td><td>'+result.data[i].writer+'</td><td>'+result.data[i].date+'</td><td>'+result.data[i].count+'</td></tr>';
                            }
                        }
                        $('.csvBoardBody table tr:first').after(table);
                } 
            });
        
        }
    }
    function next(){
        nowPage = nowPage +1;
        if(nowPage > totalPage){
            alert('마지막 페이지입니다');
            nowPage = totalPage;
        }else{
            $.ajax({
                url:'/block/'+nowPage,
                type: 'get',
                data: {amount : $('#pagingNumber').val(),category:$('#catagoryValue').val()},
                success: function(result){
                        $('.found').remove();
                        $('#paging').text('');
                        var pageNumber = (parseInt(nowPage)-1)*5+1;
                        var table ='';
                        var button = '<button onclick="prev()"><</button>';
                        if(pageNumber + 4 >= buttonAmount){
                            for(var i= pageNumber; i<=buttonAmount; i++){
                                
                                button += '<button onclick="click2('+i+')" value="'+i+'">'+i+'</button>';
                            }
                        }else{
                            for(var i= pageNumber; i <= pageNumber+4; i++){
                                
                                button += '<button onclick="click2('+i+')" value="'+i+'">'+i+'</button>';
                            }
                        }
                        button += '<button onclick="next()">></button>';  
                                    $('#paging').append(button);

                        if(result.data.length < result.amount){
                            for(var i=0;i<result.data.length;i++){
                                table += '<tr class="found"><td><input name="ckbox" type="checkbox" value="'+result.data[i].number+'"/></td><td>'+result.data[i].number+'</td><td><a href="#" onclick="selectBoard('+result.data[i].number+')">'+result.data[i].title+'</a></td><td>'+result.data[i].writer+'</td><td>'+result.data[i].date+'</td><td>'+result.data[i].count+'</td></tr>';
                            }
                        }else{
                            for(var i=0;i<result.amount;i++){
                                table += '<tr class="found"><td><input name="ckbox" type="checkbox" value="'+result.data[i].number+'"/></td><td>'+result.data[i].number+'</td><td><a href="#" onclick="selectBoard('+result.data[i].number+')">'+result.data[i].title+'</a></td><td>'+result.data[i].writer+'</td><td>'+result.data[i].date+'</td><td>'+result.data[i].count+'</td></tr>';
                            }
                        }
                        $('.csvBoardBody table tr:first').after(table);
                } 
            });
        
        }
    }