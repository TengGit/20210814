(function(_, d, q, t){
	'use strict';
	var startSpace = 1000;
	var animateSpace = 1000;
	var buttonSpace = 1750;
	var w = 1080, h = 1920, aspectRatio = w / h;
	
	var tree = [ 4,2, // root
		[ 4,3, // 出去玩
			[ 4,4, // 看电影
				[ 3 ],// 《大学》
				[ 7 ],// 《速度与激情》
				[ 4 ] // 《你好，李焕英》
			],
			[ 6,5, // 打球
				[ 7 ],// 运动饮料
				[ 2 ] // 矿泉水
			],
			[ 5,6, // 逛街
				[ 5 ],// 笔记本
				[ 6 ],// 塔罗牌
				[ 1 ] // 七夕礼物
			]
		],
		[ 5,7, // 去图书馆
			[ 3,8, // 《高等量子力学》
				[ 3 ],// 咖啡
				[ 5 ] // 水
			],
			[ 3,8, // 《百年孤独》
				[ 6 ],// 咖啡
				[ 2 ] // 水
			],
			[ 3,8, // 《老人与海》
				[ 1 ],// 咖啡
				[ 4 ] // 水
			]
		]
	];
	
	var ED_NUM = 7;
	var BG_NUM = 8;
	var BUTTON_LINE = 123;
	var BUTTON_PARAMS = [[200, 100], [620, 100], [390, 328]]
	
	var IMG_URL = "img/{0}.png";

	function $(sel) {
		return d.querySelector(sel);
	}
	
	function r(str) {
		return q.getResult(str);
	}
	
	function remove(element) {
		element.parentNode.removeChild(element);
	}
	
	function subst(str) {
		for (var i = 1; i < arguments.length; i++) {
			str = str.replace(new RegExp('\\{' + (i - 1).toString() + '\\}', 'g'), arguments[i]);
		}
		return str;
	}
	
	function adjustPosition() {
		var root = $("#root");
		var sw = document.body.clientWidth, sh = document.body.clientHeight, w = sw, h = sh;
		if (w / h < aspectRatio) {
			h = w / aspectRatio;
		} else {
			w = h * aspectRatio;
		}
		root.style.width = w + "px";
		root.style.height = h + "px";
		root.style.top = (sh - h) / 2 + "px";
		root.style.left = (sw - w) / 2 + "px";
	}
	
	function imageResource(id) {
		return {src: subst(IMG_URL, id), id: id, type: t.IMAGE};
	}
	
	var res = [];
	
	for (var i = 1; i <= ED_NUM; i++) {
		res.push({src: subst("img/e{0}.jpg", i), id: "e" + i.toString(), type: t.IMAGE, preferXHR: false});
	}
	for (var i = 1; i <= BG_NUM; i++) {
		res.push({src: subst("img/bg{0}.jpg", i), id: "bg" + i.toString(), type: t.IMAGE, preferXHR: false});
	}
	
	function buildBookAndRes(book, res, tree, bgLoaded) {
		var result;
		
		if (tree.length > 1) {
			result = [[Story.bg, "bg" + tree[1].toString()]];
			
			for (var i = 1; i <= tree[0]; i++) {
				var id = tree[1].toString() + "-" + i.toString();
				if (!bgLoaded) res.push(imageResource(id));
				result.push([Story.img, id, 0, 0]);
			}
			var btns = [Story.choice];
			for (var i = 1; i <= tree.length - 2; i++) {
				var id = "b" + tree[1].toString() + i.toString();
				if (!bgLoaded) res.push(imageResource(id));
				//debugger;
				btns.push([id, BUTTON_PARAMS[i - 1][0], BUTTON_LINE * tree[0] + BUTTON_PARAMS[i - 1][1],
				           buildBookAndRes(book, res, tree[1 + i], tree[1] == 7 && i != 1), {trans: fadeIn, transArg: [buttonSpace]}]);
			}
			result.push(btns);
		} else {
			return tree[0];
		}
		
		book.push(result);
		return book.length - 1;
	}
	var book = [[[Story.jmp, ED_NUM + 1]]];
	for (var i = 0; i < ED_NUM; i++) {
		book.push([[Story.clbg], [Story.ed, "e" + (i + 1).toString()]]);
	}
	var idx = buildBookAndRes(book, res, tree, false);

	var result = [[Story.bg, "bg1"]];
	
	for (var i = 1; i <= 7; i++) {
		var id = "1-" + i.toString();
		res.push(imageResource(id));
		result.push([Story.img, id, 0, 0]);
	}
	var btns = [Story.choice];
	for (var i = 1; i <= 3; i++) {
		var id = "b1" + i.toString();
		res.push(imageResource(id));
		btns.push([id, BUTTON_PARAMS[i - 1][0], BUTTON_LINE * 7 + BUTTON_PARAMS[i - 1][1], idx, {trans: fadeIn, transArg: [buttonSpace]}]);
	}
	result.push(btns);
	book.push(result);
	book[0][0][1] = book.length - 1;
	
	_.addEventListener("load", function () {
		adjustPosition();
		
		q.on("progress", function (e) {
			var percent = Math.floor(e.progress * 100) + "%"
			$("#percent").textContent = percent;
			$("#progress-bar").style.width = percent;
		});
		
		q.on("complete", function () {
			$("#percent").textContent = "Loaded!";
			$("#progress-bar").style.width = "100%";
			
			var start = $("#start");
			start.style.visibility = "visible";
			var startTip = $("#click-to-start");
			startTip.style.visibility = "visible";
			
			fadeIn(startTip, startSpace).setData(start).then(function(o) {
				o.data.onclick = function () {
					this.onclick = null;
					fadeOutAndDelete($("#progress-container"), startSpace);
					fadeOutAndDelete(this, startSpace).then(function() {
						new Story(book, w, h, {trans: fadeIn, transArg: [animateSpace]}).start($("#root"));
					});
				};
			});
			
		});
		
		q.loadManifest(res);
	});
	
	_.addEventListener("resize", adjustPosition);
	
	_.resource = q;
})(window, document, new createjs.LoadQueue(), createjs.Types);