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

//---------------------------------------------------------------------------------------------------------------------

$(document).ready(function(){
	d3.csv('data/dramas_money_mod.csv', function(data_drama_money){
		// console.log(data_drama_money);

		var w = 1100, h = 600, padding = 30, barMargin = 2;

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
	});

	d3.csv('data/comedy_money_mod.csv', function(data_comedy_money){
		// console.log(data_comedy_money);

		var w = 1100, h = 600, padding = 30, barMargin = 2;

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
	});

	d3.csv('data/channel_hours.csv', function(data_channel_money){

		data_channel_money.sort(function(a,b){
			a = parseInt(a['avg-hours']);
			b = parseInt(b['avg-hours']);

			return a < b ? 1 : (a > b ? -1 : 0);
		});

		for (var i = 0; i < data_channel_money.length; i++){
			var clock_block = d3.select('#clocks-container').append('div').attr('class', 'clock-block');
			clock_block.append('div').attr('class', 'clock-channel').html(data_channel_money[i]['channel']);
			clock_block.append('div').attr({'class': 'clock-image', 'id': 'clock-image-' + i}).append('img').attr('src', 'img/clock.gif');
			clock_block.append('div').attr('class', 'clock-hours').html(data_channel_money[i]['avg-hours']);
			channelHoursList.push(parseInt(data_channel_money[i]['avg-hours']));
			clockChangeList.push([i, parseInt(data_channel_money[i]['avg-hours'])]);
		}

		var avg_block = d3.select('#clocks-container').append('div').attr('class', 'clock-avg-block');
		avg_block.append('div').attr('class', 'avg-hour-text fl-left').html('平均');
		avg_block.append('div').attr('class', 'avg-clock-image fl-left').append('img').attr('src', 'img/clock_0.png');
		avg_block.append('div').attr('class', 'avg-hour-num fl-left').html('12');

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

		function onVisibilityChange (el) {
		    return function () {
		        /*your code here*/ 
		        if(isElementInViewport(el)){
		        	for (var i = 0; i < data_channel_money.length; i++){		        		
          				setTimeout(changeClockImage, calTimeout());
		        	}

		        	$(window).off('resize scroll');

		        }
		        // console.log('visibility ' + isElementInViewport(el));
		    }
		}

		var handler = onVisibilityChange($('#clocks-container'));

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
			c = a[1];
			d = b[1];

			if(c < d) return 1;

			else if(c > d) return -1;

			else{
				e = a[2];
				f = b[2];

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

		for (var i in channelListSortByDramasNum){
			var rate_block = d3.select('#dramas-rate-container').append('div').attr('class', 'dramas-rate-block');
			rate_block.append('div').attr('class', 'dramas-rate-channel').html(channelListSortByDramasNum[i][0]);
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
	 
});