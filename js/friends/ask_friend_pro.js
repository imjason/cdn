function qexo_friend_api(id, url) {
    qexo_url = url;
    var loadStyle = '<div class="qexo_loading"><div class="qexo_part"><div style="display: flex; justify-content: center"><div class="qexo_loader"><div class="qexo_inner one"></div><div class="qexo_inner two"></div><div class="qexo_inner three"></div></div></div></div><p style="text-align: center; display: block">友链申请加载中...</p></div>';
    document.getElementById(id).className = "friend-api";
    document.getElementById(id).innerHTML = loadStyle;
    document.getElementById(id).innerHTML = '<center><p>请正确填写友链，然后点击申请等待核实，请先添加本站友链</p><div class="friend-api"><style>input.qexo-friend-input {flex: 1 1 0%;display: block;width: 100%;height: calc(1.5em + 1.25rem + 2px);padding: 0.625rem 0.75rem;font-weight: 400;color: #8898aa;box-shadow: 0 3px 2px rgb(233 236 239 / 5%);transition: all 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55);overflow: visible;margin: 0;font-family: inherit;font-size: inherit;line-height: inherit;position: relative;display: flex;flex-direction: column;min-width: 0;word-wrap: break-word;background-color: #ffffff00;background-clip: border-box;border: 1px solid rgba(0, 0, 0, 0.05);border-radius: 0.375rem;black;}button.qexo-friend-button {cursor: pointer;position: relative;text-transform: none;transition: all 0.15s ease;letter-spacing: 0.025em;font-size: 0.875rem;will-change: transform;color: #fff;background-color: #5e72e4;border-color: #5e72e4;box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);vertical-align: middle;cursor: pointer;user-select: none;border: 1px solid transparent;padding: 0.625rem 1.25rem;font-size: 0.875rem;line-height: 1.5;border-radius: 0.25rem;transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;}</style><input class="qexo-friend-input" type="text" placeholder="您的站点名" id="qexo_friend_name" required><br><input class="qexo-friend-input" type="text" placeholder="请用一句话介绍您的站点" id="qexo_friend_brief introduction" required><br><input class="qexo-friend-input" type="url" placeholder="您网站首页的链接" id="qexo_friend_website" required><br><input class="qexo-friend-input" type="url" placeholder="您的网站图标(尽量为正圆形)" id="qexo_friend_logo" required><br><button class="qexo-friend-button" type="submit" onclick="askFriend(event)">申请友链</button></div></center><br>';
}
function TestUrl(url) {
    var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp=new RegExp(Expression);
    if(objExp.test(url) != true){
        return false;
    }
    return true;
}
function askFriend (event) {
    var uri = qexo_url + '/pub/ask_friend/';
    var name = document.getElementById('qexo_friend_name').value;
    var des = document.getElementById('qexo_friend_brief introduction').value;
    var url = document.getElementById('qexo_friend_website').value;
    var image = document.getElementById('qexo_friend_logo').value;
    if(!(name&&url&&image&&des)){
        VolantisApp.message('异常', '信息填写不完整!', {
            icon: 'fa-light fa-circle-exclamation red', 
            transitionIn:'bounceInDown',
            transitionOut: 'fadeOutDown',
            time: 5000
        });
        return;
    }
    if (!(TestUrl(url))){
        VolantisApp.message('异常', 'URL格式错误! 需要包含HTTP协议头!', {
            icon: 'fa-light fa-circle-exclamation red', 
            transitionIn:'bounceInDown',
            transitionOut: 'fadeOutDown',
            time: 5000
        });
        return;
    }
    if (!(TestUrl(image))){
        VolantisApp.message('异常', '图片URL格式错误! 需要包含HTTP协议头!', {
            icon: 'fa-light fa-circle-exclamation red', 
            transitionIn:'bounceInDown',
            transitionOut: 'fadeOutDown',
            time: 5000
        });
        return;
    }
    event.target.classList.add('is-loading');
    grecaptcha.ready(function() {
          grecaptcha.execute('6LdU3-UgAAAAALLKV6IltrhA2KJcjoopc4XhhxNM', {action: 'submit'}).then(function(token) {
              $.ajax({
                type: 'get',
                cache: false,
                url: uri,
                dataType: "jsonp",
                async: false,
                processData: false,
                //timeout:10000, 
                complete: function (data) {
                    if(data.status==200){
                    $.ajax({
                        type: 'POST',
                        dataType: "json",
                        data: {
                            "name": name,
                            "url": uri,
                            "image": image,
                            "description": des,
                            "verify": token,
                        },
                        success: function (data) {
                            VolantisApp.message('恭喜', '提交成功，请等待博主审核！我们不再提醒你结果，谢谢！', {
                                icon: 'fa-light fa-check light-blue', 
                                transitionIn:'bounceInDown',
                                transitionOut: 'fadeOutDown',
                                time: 5000
                             });
                        }
                    });}
                    else{
                        VolantisApp.message('异常', 'URL无法连通!', {
                            icon: 'fa-light fa-circle-exclamation red',
                            transitionIn:'bounceInDown',
                            transitionOut: 'fadeOutDown',
                            time: 5000
                        });
                    }
                    event.target.classList.remove('is-loading');
                }
          });
        });
    });
}