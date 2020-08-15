
let skburl = "https://skb.rongzimishu.com/"

var imgs1
var imgs2
let imagearr = [false, false]
$("#card_positive").on("click",()=>{
	if(imgs1 != undefined){
		$("#card_positive")[0].files = imgs1
	}else{
		$("#card_positive")[0].value = ""
	}
}).on("change", () => {
	let a = imgsize("#card_positive",0)
	if(a){
		imgs1 = $("#card_positive")[0].files
	}
	let imanext = imagearr.every((en) => {
		return en;
	})
	iman(imanext)//调用函数判断是否满足下一步条件
})
$("#card_reverse").on("click",()=>{
	if(imgs1 != undefined){
		$("#card_positive")[0].files = imgs1
	}else{
		$("#card_positive")[0].value = ""
	}
}).on("change", () => {
	let a = imgsize("#card_reverse",1)
	if(a){
		imgs2 = $("#card_reverse")[0].files
	}
	let imanext = imagearr.every((en) => {
		return en;
	})
	iman(imanext)//调用函数判断是否满足下一步条件
})

function iman(imanext) {
	if (imanext) {
		$(".next_image").css({
			"background-color": "#58a1f0",
			"pointer-events": "auto"
		})
	}
}
// 监听图片大小
function imgsize(ide,iden) {
	let files = $(ide)[0].files
	file = files[0];
	var input = $(ide)[0];
	var iLen = files.length;
	for (var i = 0; i < iLen; i++) {
		if (!input['value'].match(/.jpg|.jpeg|.png/i)) { //判断上传文件格式
			nextfun("图片格式不正确,请选择“jpg”、“jpeg”或“png”格式的图片。")
			return false;
		} else {
			imagearr[iden] = true
			var url = URL.createObjectURL(file);
			$(".auth_img>label:eq("+iden+")>img:eq(0)").attr('src', url);
			$(".form_img>div:eq("+iden+")>img").attr("src",url)
			$(".auth_img>label:eq("+iden+")>img:eq(1)").hide();
			let imanext = imagearr.every((en) => {
				return en;
			})
			iman(imanext)
			return true;
		}
	}

}


$(".next_image").on("click", () => {
	$(".loadings").css("display","flex")
	next_image()
})

function next_image() {
	let fordate = new FormData();
	fordate.append('just', imgs1[0])
	fordate.append('back', imgs2[0])
	$.ajax({
		url: skburl+"/index/Skbapi/uploadImg",
		type: 'post',
		contentType: false,
		processData: false,
		data: fordate,
		success: (data) => {
			$(".loadings").css("display","none")
			$(".forms").css("left","calc(50% - 3.75rem)")
		},
		error: (e) => {
			$(".loadings").css("display","none")
			nextfun(e.msg)
			// $(".forms").css("left","calc(50% - 3.75rem)")
		}
	});
}

// 监听所有输入框变化
let dataarr = [];
$(".form_input").on("input",()=>{
	inputvalue()
	inp()
})
var timecredentials = false
function inp(){
	for(let i = 0; i<3;i++){
		dataarr[i] = ($(".form_input input")[i].value).replace(/\s*/g,"")
	}
	let subm = dataarr.every((en) => {
		return en != "";
	})
	if(subm && timecredentials){
		$(".submits").css({
			"background-color":"#58a1f0",
			"pointer-events":"auto"
		})
	}else{
		$(".submits").css({
			"background-color":"rgba(0,0,0,0.15)",
			"pointer-events":"none"
		})
	}
}
setInterval(()=>{
	if($(".form_input>div:eq(1)>#date-group1-2")[0].value != ""){inp();timecredentials = true}
},500);


// 点击提交信息按钮
$(".submits").on("click",()=>{
	failuretime($(".form_input>div:eq(1)>input:eq(3)")[0].value)
})

function inputvalue(){
	if($(".form_input input:eq(0)")[0].value.length >= 20){
		$(".form_input input:eq(0)")[0].value = $(".form_input input:eq(0)")[0].value.slice(0,20)
	}
	if($(".form_input input:eq(1)")[0].value.length >= 30){
		$(".form_input input:eq(1)")[0].value = $(".form_input input:eq(1)")[0].value.slice(0,30)
	}
	if($(".form_input input:eq(2)")[0].value.length >= 25){
		$(".form_input input:eq(2)")[0].value = $(".form_input input:eq(2)")[0].value.slice(0,25)
	}
}

// 提示弹窗
function nextfun(masdata,fun){
	if(masdata == undefined){
		masdata = "加载失败。"
	}
	let next_form = document.createElement("div");
	next_form.className = "next_form";
	next_form.innerHTML = `
	<h6>${masdata}</h6>
	<div>
		<a>取消</a>
		<a class="btns">确定</a>
	</div>
	`
	$("body")[0].appendChild(next_form);
	$(".next_form>div").on("click",(enbtnqd)=>{
		if(enbtnqd.target.className == "btns"){
			if(fun != undefined){
				fun()
			}
		}
		$(".next_form").css("display","none")
	})
}

// 监听返回上传图片页
$(".forms>.auth_head>a:eq(0)").on("click",()=>{
	// location.reload()
	$(".forms").css("left","100vw")
})

// 判断失效时间格式
function failuretime(date){
	let da = new Date();
	let year= da .getFullYear();
	let month= da .getMonth()+1;
	let dat= da .getDate();
	let a = date.split("-")
	if(a[0]<year){
		nextfun("输入年份有误，不能早于当前时间。")
	}else if(a[0]==year && a[1]<month ){
		nextfun("输入月份有误，不能早于当前时间。")
	}else if(a[0]==year && a[1]==month && a[2]<dat ){
		nextfun("输入日期有误，不能早于当前时间。")
	}else{
		$(".loadings").css("display","flex")
		$.ajax({
			url: skburl+"/index/Skbapi/uploadCard",
			type: 'post',
			data:{
				loginId:dataarr[0],
				idCard:dataarr[2],
				timer:$(".form_input>div:eq(1)>input:eq(3)")[0].value,
				account:dataarr[1]
			},
			success: (data) => {
				$(".loadings").css("display","none")
				jump()
			},
			error: (e) => {
				$(".loadings").css("display","none")
				nextfun(JSON.parse(e.responseText).msg)
				
			}
		});
	}
}

// 跳转函数
function jump(){
	let htmls = document.createElement("div")
	htmls.className = "jumpcountdown"
	htmls.innerHTML = `
	<img src="img/su.png" >
	<h4>认证成功</h4>
	<h4>“<p>3</p>”秒后自动跳转。</h4>
	`
	document.querySelector("body").appendChild(htmls)
	let i =3;
	setInterval(()=>{
		i--;
		$(".jumpcountdown>h4>p")[0].innerHTML = i
		if(i <= 0){
			window.history.back(-1);
		}
	},1000);
}

// 防止ios光标位置偏移的问题
document.body.addEventListener('focusin', () => {
	// 软键盘弹出的事件处理
	this.isReset = false
})
document.body.addEventListener('focusout', () => {
	// 软键盘收起的事件处理
	this.isReset = true
	setTimeout(() => {
		// 当焦点在弹出层的输入框之间切换时先不归位
		if (this.isReset) {
			window.scroll(0, 0) // 失焦后强制让页面归位
		}
	}, 300)
})

