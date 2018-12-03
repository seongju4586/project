var nowPage = 1;
var totalPage = 0;
var buttonAmount = 0;
$(function(){
    $.ajax({
        
        url: '/list',
        type: 'get',
        data: {amount : $('#pagingNumber').val(),category:$('#catagoryValue').val()},
        success: function(result){

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
         
            $('.category:first').css({'color':'black','font-weight':'bold','background-color':'white'});
            
        }
    });
    $('.category').on('click',function(){
        $('.category').removeAttr('style');
        $(this).css({'color':'black','font-weight':'bold','background-color':'white'});
        $.ajax({
            url: '/list/kinds',
            type: 'get',
            data: {amount : $('#pagingNumber').val(),category: $(this).text()},
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
                $('#catagoryValue').val(result.category);
                nowPage=1;
            }
        });
    })
});
