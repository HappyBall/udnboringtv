if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // some code..
 // window.location.href = "http://p.udn.com.tw/upf/newmedia/2015_data/20150612_udnnbapass/udnnbapass_m/index.html";
}

var regionList = ['台灣', '大陸', '合拍', '韓國', '日本'];
var regionColorList = ['#35A6EC', '#8CC63E', '#D81B5E', '#F38713', '#65C7D0'];
var channelHoursList = [];
var count_hours = 0, count_change_image = 0;
var clockChangeList = [];
var channel_dramas_dict = {};
var channelListSortByDramasNum = [];
var dramasMaxNum = 12;
var clockInViewd = 0;
var animateInViewd = 0;
var video_play = 0;

//---------------------------------------------------------------------------------------------------------------------

$(document).ready(function(){

	

	d3.csv('data/dramas_money_mod.csv', function(data_drama_money){
		// console.log(data_drama_money);

		var w = 1100, h = 400, padding = 30, barMargin = 2;

		var Ymax = d3.max(data_drama_money, function(d){return parseInt(d['money'])}),
			Ymin = d3.min(data_drama_money, function(d){return parseInt(d['money'])});

		var xScale = d3.scale.linear()
						.domain([0, data_drama_money.length])
						.range([padding, w - padding]);

		var yScale = d3.scale.linear()
						.domain([Ymin, Ymax])
						.range([padding, h-padding]);

		var barWidth = (w - padding*2) / data_drama_money.length - barMargin;

		var tip = d3.tip().offset([-30, 0]).attr('class', 'd3-tip').html(function(d) { return d['program'] + '<br>' + d['money'] + '萬元<br>' + d['channel']; });

		var svg = d3.select('#svg-drama-money').append('svg').attr({'width': w, 'height': h});

		svg.call(tip);

		svg.selectAll('rect').data(data_drama_money).enter().append('rect')
			.attr({
				'x': function(d, i){return xScale(i)},
				'y': function(d){return h - yScale(parseInt(d['money']))},
				'width': barWidth,
				'height': function(d){return yScale(parseInt(d['money']))},
				'fill': function(d){return regionColorList[regionList.indexOf(d['region'])]}
			})
			.on('mouseover', function(d){
				tip.show(d);
				$(this).attr('fill', '#DAE0E9');
			})
			.on('mouseout', function(d){
				tip.hide(d);
				$(this).attr('fill', regionColorList[regionList.indexOf(d['region'])]);
			});

		var intro_line_block = d3.select('#svg-drama-money').append('div').attr('class', 'vertical-line-block').style({'left': '4.2%', 'bottom': '90px'});
		intro_line_block.append("div").attr("class", "vertical-line").style('height', '150px');
		intro_line_block.append("div").attr("class", "vertical-label myfont").text("每一長條代表一部戲劇節目").style({'left': '-10px', 'top': '-25px'});
	});

	d3.csv('data/comedy_money_mod.csv', function(data_comedy_money){
		// console.log(data_comedy_money);

		var w = 1100, h = 400, padding = 30, barMargin = 2;

		var Ymax = d3.max(data_comedy_money, function(d){return parseInt(d['money'])}),
			Ymin = d3.min(data_comedy_money, function(d){return parseInt(d['money'])});

		var xScale = d3.scale.linear()
						.domain([0, data_comedy_money.length])
						.range([padding, w - padding]);

		var yScale = d3.scale.linear()
						.domain([Ymin, Ymax])
						.range([padding, h-padding]);

		var barWidth = (w - padding*2) / data_comedy_money.length - barMargin;

		var tip = d3.tip().offset([-30, 0]).attr('class', 'd3-tip').html(function(d) { return d['program'] + '<br>' + d['money'] + '萬元<br>' + d['channel']; });

		var svg = d3.select('#svg-comedy-money').append('svg').attr({'width': w, 'height': h});

		svg.call(tip);

		svg.selectAll('rect').data(data_comedy_money).enter().append('rect')
			.attr({
				'x': function(d, i){return xScale(i)},
				'y': function(d){return h - yScale(parseInt(d['money']))},
				'width': barWidth,
				'height': function(d){return yScale(parseInt(d['money']))},
				'fill': function(d){return regionColorList[regionList.indexOf(d['region'])]}
			})
			.on('mouseover', function(d){
				tip.show(d);
				$(this).attr('fill', '#DAE0E9');
			})
			.on('mouseout', function(d){
				tip.hide(d);
				$(this).attr('fill', regionColorList[regionList.indexOf(d['region'])]);
			});

		var intro_line_block = d3.select('#svg-comedy-money').append('div').attr('class', 'vertical-line-block').style({'left': '4.2%', 'bottom': '220px'});
		intro_line_block.append("div").attr("class", "vertical-line").style('height', '100px');
		intro_line_block.append("div").attr("class", "vertical-label myfont").text("每一長條代表一部綜藝節目").style({'left': '-10px', 'top': '-25px'});
	});

	d3.csv('data/channel_hours.csv', function(data_channel_hours){

		data_channel_hours.sort(function(a,b){
			a = parseInt(a['avg-hours']);
			b = parseInt(b['avg-hours']);

			return a < b ? 1 : (a > b ? -1 : 0);
		});

		for (var i = 0; i < data_channel_hours.length; i++){
			var clock_block = d3.select('#clocks-container').append('div').attr('class', 'clock-block');
			clock_block.append('div').attr('class', 'clock-channel myfont').html(data_channel_hours[i]['channel']);
			clock_block.append('div').attr({'class': 'clock-image', 'id': 'clock-image-' + i}).append('img').attr('src', 'img/clock.gif');
			clock_block.append('div').attr('class', 'clock-hours').html(data_channel_hours[i]['avg-hours']);
			channelHoursList.push(parseInt(data_channel_hours[i]['avg-hours']));
			clockChangeList.push([i, parseInt(data_channel_hours[i]['avg-hours'])]);
		}

		var avg_block = d3.select('#clocks-container').append('div').attr('class', 'clock-avg-block');
		avg_block.append('div').attr('class', 'avg-hour-text fl-left myfont').html('平均');
		avg_block.append('div').attr('class', 'avg-clock-image fl-left').append('img').attr('src', 'img/clock_0.png');
		avg_block.append('div').attr('class', 'avg-hour-num fl-left myfont').html('12');

		clockChangeList.sort(function(a,b){
			a = a[1];
			b = b[1];

			return a < b ? -1 : (a > b ? 1 : 0);
		});

		// console.log(clockChangeList);

		function isElementInViewport (el) {

		    //special bonus for those using jQuery
		    if (typeof jQuery === "function" && el instanceof jQuery) {
		        el = el[0];
		    }

		    var rect = el.getBoundingClientRect();

		    return (rect.bottom >= 0 && rect.right >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.left <= (window.innerWidth || document.documentElement.clientWidth));
		}

		// function onVisibilityChangeVideo (el) {
		//     return function () {
		//         /*your code here*/ 
		//         if(isElementInViewport(el)){
		//         	var v = document.getElementById('boringtv-video');
		//         	v.play();
		//         	$(window).off('scroll');

		//         	console.log('in view');
		//         }
		//     }
		// }

		function onVisibilityChange () {
		    return function () {
		        /*your code here*/ 
		        /*if(clockInViewd == 1 && animateInViewd == 1){
		        	$(window).off('resize scroll');
		        	return;
		        }*/

		        if(isElementInViewport($('#clocks-container')) && clockInViewd == 0) {
		        	for (var i = 0; i < data_channel_hours.length; i++){		        		
          				setTimeout(changeClockImage, calTimeout());
		        	}

		        	clockInViewd = 1;

		        	/*$(window).off('resize scroll');

		        	var handler = onVisibilityChangeVideo($('#boringtv-video'));

		        	$(window).on('scroll', handler);

		        	console.log('abafdsa');*/

		        }

		        if(isElementInViewport($('#boringtv-video'))){
		        	var v = document.getElementById('boringtv-video');
		        	v.play();
		        	video_play = 1;
		        	$('#play-video-img').css('display', 'none');
		        	// animateInViewd = 1;
		        }
		        else{
		        	var v = document.getElementById('boringtv-video');
		        	v.pause();
		        	video_play = 0;
		        	$('#play-video-img').css('display', 'table');
		        }
		        // console.log('visibility ' + isElementInViewport(el));
		    }
		}

		var handler = onVisibilityChange();

		$(window).on('resize scroll', handler);

		function changeClockImage(){ 
			var id_now = clockChangeList[count_change_image][0];
			$('#clock-image-' + id_now + ' img').attr('src', 'img/clock_' + (channelHoursList[id_now]%12).toString() + '.png');
			count_change_image += 1;
		}

		function calTimeout(){
			// console.log(count_hours);
			var time = 200 * channelHoursList[count_hours];
			count_hours += 1;
			// console.log(time);
			return time;
		}
	});

	d3.csv('data/channel_dramas.csv', function(data_channel_dramas){
		// console.log(data_channel_dramas);
		for (var i in data_channel_dramas){
			if (data_channel_dramas[i]['channel'] in channel_dramas_dict == false){
				channel_dramas_dict[data_channel_dramas[i]['channel']] = {};
				channel_dramas_dict[data_channel_dramas[i]['channel']]['local'] = [];
				channel_dramas_dict[data_channel_dramas[i]['channel']]['foreign'] = [];
			}

			if(data_channel_dramas[i]['region'] == '國語' || data_channel_dramas[i]['region'] == '台語' || data_channel_dramas[i]['region'] == '客語')
				channel_dramas_dict[data_channel_dramas[i]['channel']]['local'].push(data_channel_dramas[i]);
			else
				channel_dramas_dict[data_channel_dramas[i]['channel']]['foreign'].push(data_channel_dramas[i]);

			
		}

		// console.log(channel_dramas_dict);

		for (var i in channel_dramas_dict){
			channelListSortByDramasNum.push([i, channel_dramas_dict[i]['foreign'].length + channel_dramas_dict[i]['local'].length, channel_dramas_dict[i]['foreign'].length]);
		}

		channelListSortByDramasNum.sort(function(a,b){
			c = a[2];
			d = b[2];

			if(c < d) return 1;

			else if(c > d) return -1;

			else{
				e = a[1];
				f = b[1];

				if(e < f) return 1;

				else if(e > f) return -1;

				else return 0;
			}

			/*return c < d ? 1 : (c > d ? -1 : function(a,b){
				e = a[2];
				f = b[2];

				return e < f ? 1: (e > d ? -1 : 0);
			});*/
		});

		// console.log(channelListSortByDramasNum);
		var change_item = channelListSortByDramasNum[25];
		channelListSortByDramasNum[25] = channelListSortByDramasNum[26];
		channelListSortByDramasNum[26] = change_item;

		for (var i in channelListSortByDramasNum){
			var rate_block = d3.select('#dramas-rate-container').append('div').attr('class', 'dramas-rate-block');
			rate_block.append('div').attr('class', 'dramas-rate-channel myfont').html(channelListSortByDramasNum[i][0]);
			var rate_bars = rate_block.append('div').attr('class', 'dramas-rate-bars');
			rate_block.append('div').attr('class', 'dramas-rate-percent').html(Math.round((channel_dramas_dict[channelListSortByDramasNum[i][0]]['foreign'].length/channelListSortByDramasNum[i][1])*100) + '%');

			for (var j = 0; j < channel_dramas_dict[channelListSortByDramasNum[i][0]]['foreign'].length; j++){
				rate_bars.append('div').attr({
					'class': 'rate-bar white-tooltip', 
					'data-toggle': 'tooltip', 
					'data-placement': 'top', 
					'title': channel_dramas_dict[channelListSortByDramasNum[i][0]]['foreign'][j]['program'] + '-' + channel_dramas_dict[channelListSortByDramasNum[i][0]]['foreign'][j]['region'],
					'data-html': 'true',
					'region': 'foreign'
				}).style({'width': 100/dramasMaxNum + '%', 'background-color': '#E83828'});
			}

			for (var j = 0; j < channel_dramas_dict[channelListSortByDramasNum[i][0]]['local'].length; j++){
				rate_bars.append('div').attr({
					'class': 'rate-bar white-tooltip', 
					'data-toggle': 'tooltip', 
					'data-placement': 'top', 
					'title': channel_dramas_dict[channelListSortByDramasNum[i][0]]['local'][j]['program'] + '-' + channel_dramas_dict[channelListSortByDramasNum[i][0]]['local'][j]['region'], 
					'data-html': 'true',
					'region': 'local'
				}).style({'width': 100/dramasMaxNum + '%', 'background-color': '#C9CACA'});
			}			
		}

		
		$('[data-toggle="tooltip"]').tooltip();

		$('.rate-bar')
		.on('mouseover', function(){
			$(this).css('background-color', '#F6AFA9');
		})
		.on('mouseout',function(){
			var r = $(this).attr('region');

			if(r == 'local')
				$(this).css('background-color', '#C9CACA');
			else
				$(this).css('background-color', '#E83828');
		});
		
	});

	document.getElementById('boringtv-video').addEventListener('ended',myHandler,false);

    function myHandler(e) {
        // What you want to do after the event
        $(window).off('resize scroll');
        $('#play-video-img').css('display', 'table');
        video_play = 0;
    }

    var video = document.getElementById('video-container');
	video.addEventListener('click',function(){
		if(video_play == 0){
			document.getElementById('boringtv-video').play();
			video_play = 1;
			$('#play-video-img').css('display', 'none');
		}

		else{
			document.getElementById('boringtv-video').pause();
			video_play = 0;
			$('#play-video-img').css('display', 'table');
		}
	  
	},false);

    $('#play-video-img').css({
		'top': ($('.video-wrap').height()/2) - 35,
		'left': ($('.video-wrap').width()/2) - 35
	});
	 
});