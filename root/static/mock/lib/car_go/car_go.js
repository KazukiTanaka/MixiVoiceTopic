/**
 * @author nilfs
 */
(function(){

	function initScript($){
		$.fn.car_go = function(config){
			config = jQuery.extend({
				'default' : 'default'
			},config);
			
			function initView(targetEl){
				
			}
			
			initView(this);
			
			return this;
		};
		
		// １発言のView
		$.fn.tweetBody = function(config){
			var defaultParams = {
				'icon': 'images/user-icon.png',
				'tweet': '',
				'rank' : '3'							// 強調レベル(1が最高で自分やルートメッセージは強調表示にしたりする)
	//			'uniqueId': 100
			};
			var options = $.extend(defaultParams, config);
	
			function init(target){
				var body = $('<li></li>');
				
				var tweet = $('<a href="#" class="tweet"></a>').html(options.tweet);
				var userIcon = $('<img></img>').attr('src', options.icon);
				var editBtn = $("<a href='#tweet-edit' data-rel='dialog'>編集</a>").bind('click', function(event){
					
				});
				body.append(userIcon).append(tweet).append(editBtn)
					.appendTo(target);
			}
	
			init(this);
			return this;		
		}
	
		// １発言のView
		$.fn.tweetBody2 = function(config){
			var defaultParams = {
				'icon': 'images/user-icon.png',
				'tweet': '',
				'rank' : '3'							// 強調レベル(1が最高で自分やルートメッセージは強調表示にしたりする)
	//			'uniqueId': 100
			};
			var options = $.extend(defaultParams, config);
	
			function init(target){
				var body = $('<li><div>ほげほげ</div></li>');
				
				var tweet = $('<a href="#related-voice-panel" class="tweet"></a>').html(options.tweet);
				var userIcon = $('<img></img>').attr('src', options.icon);
				body.append(userIcon).append(tweet)
					.appendTo(target);
			}
	
			init(this);
			return this;		
		}
		
		// つぶやきの表示
		$.fn.tweetView = function(config){
			var defaultParams = {
				'tweets' : []
			};
			var options = $.extend(defaultParams, config);
	
			function init(targetEl){
	
				var body = $('<ul data-role="listview" data-theme="g"　data-inset="true" data-split-icon="gear"></ul>');
				var tweets = options.tweets;
				var length = tweets.length;
				for( var i=0; i<length; ++i ){
					body.tweetBody(tweets[i]);
				}
	
				targetEl.append(body);
			}
			
			init(this);
			return this;
		}
		
		// メインの一覧画面
		$.fn.streamPanel = function(config){
			
			var defaultParams = {
				'tweets' : []
			};
			var options = $.extend(defaultParams, config);
	
			function init(targetEl){
				var body = $('<ul data-role="listview" data-theme="g"></ul>');
				var tweets = options.tweets;
				var length = tweets.length;
				for( var i=0; i<length; ++i ){
					body.tweetBody2(tweets[i]);
				}
	
				targetEl.append(body);
			}
			
			init(this);
			return this;
		}
		
		// １つの発言からたどれる一連の流れの画面
		$.fn.detailStreamPanel = function(config){
	
			function init(targetEl){
				targetEl.tweetView({
					'tweets':[{
							'tweet': '山にいきたいなー',
							'rank': 1
						},{
							'tweet': 'いいっすね。どのへんの山ですか？？？',
							'icon': 'images/user-icon2.png',
							'rank': 1
						},{
							'tweet': '２０００m越え！',
							'rank': 1
						},{
							'tweet': 'ハードルたかっ',
							'icon': 'images/user-icon2.png',
							'rank': 1
						}
					]
				});
				/*
				.tweetView({
					'tweet': 'test2',
					'icon': 'images/user-icon2.png',
					'rank': 1
				}).tweetView({
					'tweet': 'test3',
					'rank': 1
				});*/
			}
			
			init(this);
			return this;
		};
		
		// 自分に関係する発言一覧

		// 
		$.fn.setupPages = function(config){
			var defaultParams = {
				'theme' : 'b'
			};
			var options = $.extend(defaultParams, config);
			
			$('div[data-role=header],div[data-role=footer]').attr('data-theme', options.theme);
			return this;
		};
		
		// リスト表示の１つぶやき
		$.widget( "emergeto.tweetColumn", $.mobile.widget, {
			options: {
				rank: 1
			},
			_create: function(){
				
			}
		} );
		
		//	main pageの中身
		$.widget( "emergeto.streamPanel", $.mobile.widget, {
			_create: function(){
				// setup my widget
				var updateBtn = $('<a href="#" data-role="button">Update</a>');
				updateBtn.bind('click', function(){
					
				});
				this.element.append( updateBtn );
				
				this._buildHTML( this.options.data );
			},
			destroy: function(){
				// 
			},
			
			// private methods
			_buildHTML: function(contents){
				var listEl = $('<ul data-role="listview"></ul>');
				var messageBodyTpl = $('<img style="position:static" src="dummy"></img><a href="#" style="height:80px"></a>');

				//var contents = json.contens;
				var length = contents.length;
				for( var i = 0; i<length; ++i ){
					var tweetData = contents[i];

					var messageBody = this._createMessageBody( messageBodyTpl, tweetData );
					if( tweetData.reply_list ){
						this._addConversationPage( 'conversation'+i, tweetData.reply_list );
						$(messageBody[1]).attr('href', '#conversation'+i);
					}
				
					listEl.append( $('<li></li>').append(messageBody));
				}
				
				this.element.append(listEl);
			},
			_createMessageBody: function( tpl, messageJSON ){
				var messageBody = tpl.clone();
				$(messageBody[0]).attr('src', messageJSON.user.profile_image_url );
				$(messageBody[1]).html(messageJSON.text);
				return messageBody;
			},
			_addConversationPage: function( name, replyList ){
				var page = $('#conversationTpl').clone();
				page.attr('id', name);
				var content = page.find('[data-role="content"]');
				content.streamPanel({'data': replyList});
								
				$(document.body).append(page);
			}
		});
		
		/*
		$.widget('emergeto.streamPanel', {
			options: {
				theme: "c",
				countTheme: "c",
				headerTheme: "b",
				dividerTheme: "b",
				splitIcon: "arrow-r",
				splitTheme: "b",
				inset: false
			},
			_create: function(){
				
			},
			
			refresh: function(){
				alert('refresh!');
			}
		});
		*/		
	};

	$(document).ready(function(){
		
		function getJSON(){
			return $.parseJSON('{"contens":[{"favorite_list":[{"profile_image_url":"http://profile.img.mixi.jp/photo/user/wj484htgzgd78_3596577078.jpg","url":"http://mixi.jp/show_friend.pl?uid=wj484htgzgd78","id":"wj484htgzgd78","screen_name":"た〜〜〜こ"},{"profile_image_url":"http://profile.img.mixi.jp/photo/user/ar19jb7brkoen_2463658959.jpg","url":"http://mixi.jp/show_friend.pl?uid=ar19jb7brkoen","id":"ar19jb7brkoen","screen_name":"のむたろ〜"},{"profile_image_url":"http://profile.img.mixi.jp/photo/user/fgomqdc31idfk_38739526373.jpg","url":"http://mixi.jp/show_friend.pl?uid=fgomqdc31idfk","id":"fgomqdc31idfk","screen_name":"ゆり"}],"favorited":false,"created_at":"Tue Feb 15 14:44:04 +0000 2011","text":"あー膝枕されたい","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110215234404","favorite_count":"3"},{"favorite_list":[{"profile_image_url":"http://profile.img.mixi.jp/photo/user/ezkjdy9s8rwsc_908263351.jpg","url":"http://mixi.jp/show_friend.pl?uid=ezkjdy9s8rwsc","id":"ezkjdy9s8rwsc","screen_name":"ザキ"},{"profile_image_url":"http://profile.img.mixi.jp/photo/user/47meerc63k7jq_1438500085.jpg","url":"http://mixi.jp/show_friend.pl?uid=47meerc63k7jq","id":"47meerc63k7jq","screen_name":"Ochyai"}],"favorited":false,"created_at":"Thu Feb 10 14:26:38 +0000 2011","text":"明日は結構大事","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110210232638","favorite_count":"2"},{"favorite_list":[{"profile_image_url":"http://profile.img.mixi.jp/photo/user/wj484htgzgd78_3596577078.jpg","url":"http://mixi.jp/show_friend.pl?uid=wj484htgzgd78","id":"wj484htgzgd78","screen_name":"た〜〜〜こ"},{"profile_image_url":"http://profile.img.mixi.jp/photo/user/88ap4tqg4hkmd_3825300050.jpg","url":"http://mixi.jp/show_friend.pl?uid=88ap4tqg4hkmd","id":"88ap4tqg4hkmd","screen_name":"nismo"},{"profile_image_url":"http://profile.img.mixi.jp/photo/user/reqe7poct6oxc_4254778316.jpg","url":"http://mixi.jp/show_friend.pl?uid=reqe7poct6oxc","id":"reqe7poct6oxc","screen_name":"STAR FUND Co."}],"favorited":false,"created_at":"Thu Feb 10 14:23:54 +0000 2011","text":"頭をなでなでされたい","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110210232354","favorite_count":"3"},{"reply_list":[{"created_at":"Sat Feb 05 07:09:22 +0000 2011","text":"水戸においでよ[i:203]","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/fgomqdc31idfk_38739526373.jpg","url":"http://mixi.jp/show_friend.pl?uid=fgomqdc31idfk","id":"fgomqdc31idfk","screen_name":"ゆり"},"id":"8nhyg46freg7m-20110205160611-fgomqdc31idfk-20110205160922"},{"created_at":"Sat Feb 05 07:37:00 +0000 2011","text":"水戸は有名ですね。運転よろしくwww ちょうど朝のニュースで水戸も出てた。","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110205160611-8nhyg46freg7m-20110205163700"},{"created_at":"Sat Feb 05 08:21:19 +0000 2011","text":"運転？偕楽園は梅の時期だけ、偕楽園駅を使えるよ!!てか、偕楽園とか自転車だし←","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/fgomqdc31idfk_38739526373.jpg","url":"http://mixi.jp/show_friend.pl?uid=fgomqdc31idfk","id":"fgomqdc31idfk","screen_name":"ゆり"},"id":"8nhyg46freg7m-20110205160611-fgomqdc31idfk-20110205172119"},{"created_at":"Sat Feb 05 08:37:22 +0000 2011","text":"全く地理がわからない。近いなら楽勝だな。まぁ行くやつ見つけないといかなそーだけどw","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110205160611-8nhyg46freg7m-20110205173722"},{"created_at":"Sat Feb 05 13:12:06 +0000 2011","text":"地元くおりてぃでの近いだけどねｗｗ","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/fgomqdc31idfk_38739526373.jpg","url":"http://mixi.jp/show_friend.pl?uid=fgomqdc31idfk","id":"fgomqdc31idfk","screen_name":"ゆり"},"id":"8nhyg46freg7m-20110205160611-fgomqdc31idfk-20110205221206"},{"created_at":"Sat Feb 05 15:22:44 +0000 2011","text":"水戸に行っても他に何も目的がないのもつらいな。 地元くおりてぃはもう忘れてしまったのでwww","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110205160611-8nhyg46freg7m-20110206002244"},{"created_at":"Sat Feb 05 15:33:26 +0000 2011","text":"そっかー。あたしとタイミングあうなら相手するのだけども!!","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/fgomqdc31idfk_38739526373.jpg","url":"http://mixi.jp/show_friend.pl?uid=fgomqdc31idfk","id":"fgomqdc31idfk","screen_name":"ゆり"},"id":"8nhyg46freg7m-20110205160611-fgomqdc31idfk-20110206003326"},{"created_at":"Sat Feb 05 15:56:35 +0000 2011","text":"じゃあタイミング調整よろしく！","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110205160611-8nhyg46freg7m-20110206005635"},{"created_at":"Sat Feb 05 15:56:55 +0000 2011","text":"ってか彼氏的にダメだろwww","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110205160611-8nhyg46freg7m-20110206005655"},{"created_at":"Sat Feb 05 16:17:59 +0000 2011","text":"んー、どうだろうｗ実家かえりたいしー、そのついでに久しぶりに梅も見に行きたいし!!みたいな？うん。 あたしは楽しければなんでもいいでっす[i:150][i:150][i:150]","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/fgomqdc31idfk_38739526373.jpg","url":"http://mixi.jp/show_friend.pl?uid=fgomqdc31idfk","id":"fgomqdc31idfk","screen_name":"ゆり"},"id":"8nhyg46freg7m-20110205160611-fgomqdc31idfk-20110206011759"},{"created_at":"Sat Feb 05 16:26:22 +0000 2011","text":"まー問題無ければ、いきますよー","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110205160611-8nhyg46freg7m-20110206012622"}],"favorited":false,"created_at":"Sat Feb 05 07:06:11 +0000 2011","text":"最近、カメラ買ったし時期がいいから梅、観に行きたい！http://www.rurubu.com/season/winter/ume/","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110205160611","reply_count":"11"},{"reply_list":[{"created_at":"Sat Feb 05 08:33:56 +0000 2011","text":"事前に先生とかに許可もらえれば入れるのに〜","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/ar19jb7brkoen_2463658959.jpg","url":"http://mixi.jp/show_friend.pl?uid=ar19jb7brkoen","id":"ar19jb7brkoen","screen_name":"のむたろ〜"},"id":"8nhyg46freg7m-20110205143239-ar19jb7brkoen-20110205173356"},{"created_at":"Sat Feb 05 08:35:58 +0000 2011","text":"事前に行きたかったか、わけじゃないからねー","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110205143239-8nhyg46freg7m-20110205173558"},{"created_at":"Sat Feb 05 09:06:06 +0000 2011","text":"ちなみに今は終わってるから自由に入れた．","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/ar19jb7brkoen_2463658959.jpg","url":"http://mixi.jp/show_friend.pl?uid=ar19jb7brkoen","id":"ar19jb7brkoen","screen_name":"のむたろ〜"},"id":"8nhyg46freg7m-20110205143239-ar19jb7brkoen-20110205180606"}],"favorited":false,"created_at":"Sat Feb 05 05:32:39 +0000 2011","text":"大学が受験で入れなかった。ショック","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110205143239","reply_count":"3"},{"reply_list":[{"created_at":"Fri Feb 04 22:25:57 +0000 2011","text":"あー，そういうじきだよねー．更新はするんでしょー？","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/fgomqdc31idfk_38739526373.jpg","url":"http://mixi.jp/show_friend.pl?uid=fgomqdc31idfk","id":"fgomqdc31idfk","screen_name":"ゆり"},"id":"8nhyg46freg7m-20110205072526-fgomqdc31idfk-20110205072557"},{"created_at":"Sat Feb 05 05:30:39 +0000 2011","text":"まぁするんだけどさー高いなぁと","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110205072526-8nhyg46freg7m-20110205143039"},{"created_at":"Sat Feb 05 08:22:04 +0000 2011","text":"あーそうねー、高いよね。","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/fgomqdc31idfk_38739526373.jpg","url":"http://mixi.jp/show_friend.pl?uid=fgomqdc31idfk","id":"fgomqdc31idfk","screen_name":"ゆり"},"id":"8nhyg46freg7m-20110205072526-fgomqdc31idfk-20110205172204"}],"favorited":false,"created_at":"Fri Feb 04 22:25:26 +0000 2011","text":"更新料どうしよっかなー","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110205072526","reply_count":"3"},{"reply_list":[{"created_at":"Thu Feb 03 14:00:43 +0000 2011","text":"カップラーメンは全部ジャンクだろう、、、ｗ","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/z5orjocpj43rn_3778871592.jpg","url":"http://mixi.jp/show_friend.pl?uid=z5orjocpj43rn","id":"z5orjocpj43rn","screen_name":"なるるん"},"id":"8nhyg46freg7m-20110203225942-z5orjocpj43rn-20110203230043"},{"created_at":"Thu Feb 03 14:47:28 +0000 2011","text":"まぁ確かに。それは否定できない","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110203225942-8nhyg46freg7m-20110203234728"},{"created_at":"Thu Feb 03 16:18:35 +0000 2011","text":"ｶｯﾌﾟﾗｰﾒﾝの中でもｽｰﾊﾟｰｶﾌﾟのｼﾞｬﾝｸ度はﾊﾝﾊﾟじゃないと思う。量重視っぽいから尚更そう感じる・・・","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/88ap4tqg4hkmd_3825300050.jpg","url":"http://mixi.jp/show_friend.pl?uid=88ap4tqg4hkmd","id":"88ap4tqg4hkmd","screen_name":"nismo"},"id":"8nhyg46freg7m-20110203225942-88ap4tqg4hkmd-20110204011835"},{"created_at":"Thu Feb 03 16:40:13 +0000 2011","text":"物足りなくてポテチも食べたのは内緒","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110203225942-8nhyg46freg7m-20110204014013"}],"favorited":false,"created_at":"Thu Feb 03 13:59:42 +0000 2011","text":"スーパーカップはジャンクだな","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110203225942","reply_count":"4"},{"favorite_list":[{"profile_image_url":"http://profile.img.mixi.jp/photo/user/wj484htgzgd78_3596577078.jpg","url":"http://mixi.jp/show_friend.pl?uid=wj484htgzgd78","id":"wj484htgzgd78","screen_name":"た〜〜〜こ"},{"profile_image_url":"http://profile.img.mixi.jp/photo/user/6czwkwtwnqi3k_359438177.jpg","url":"http://mixi.jp/show_friend.pl?uid=6czwkwtwnqi3k","id":"6czwkwtwnqi3k","screen_name":"レミウィンクス"},{"profile_image_url":"http://profile.img.mixi.jp/photo/user/g57i4auh3mx3y_2674234366.jpg","url":"http://mixi.jp/show_friend.pl?uid=g57i4auh3mx3y","id":"g57i4auh3mx3y","screen_name":"素甘（賞味期限切れ）"},{"profile_image_url":"http://profile.img.mixi.jp/photo/user/ar19jb7brkoen_2463658959.jpg","url":"http://mixi.jp/show_friend.pl?uid=ar19jb7brkoen","id":"ar19jb7brkoen","screen_name":"のむたろ〜"}],"favorited":false,"created_at":"Thu Jan 27 15:52:30 +0000 2011","text":"週末は写真取りにでかけよーっと  ","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110128005230","favorite_count":"4"},{"reply_list":[{"created_at":"Mon Jan 24 14:14:07 +0000 2011","text":"どぉしたの[e:3][e:3][e:330]","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/sh7qe94c9eihx_1858353805.jpg","url":"http://mixi.jp/show_friend.pl?uid=sh7qe94c9eihx","id":"sh7qe94c9eihx","screen_name":"トロ"},"id":"8nhyg46freg7m-20110124230951-sh7qe94c9eihx-20110124231407"},{"created_at":"Mon Jan 24 15:31:26 +0000 2011","text":"どぉしたんだろう。","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110124230951-8nhyg46freg7m-20110125003126"},{"created_at":"Mon Jan 24 22:17:14 +0000 2011","text":"毎日元気ないお[e:350]  無理しないでいくお[e:731]","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/reqe7poct6oxc_4254778316.jpg","url":"http://mixi.jp/show_friend.pl?uid=reqe7poct6oxc","id":"reqe7poct6oxc","screen_name":"STAR FUND Co."},"id":"8nhyg46freg7m-20110124230951-reqe7poct6oxc-20110125071714"},{"created_at":"Mon Jan 24 23:03:28 +0000 2011","text":"あたしも色々なことが決まらなくなってきて、元気なぃ[e:732]朝なのに[e:443][e:330]","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/sh7qe94c9eihx_1858353805.jpg","url":"http://mixi.jp/show_friend.pl?uid=sh7qe94c9eihx","id":"sh7qe94c9eihx","screen_name":"トロ"},"id":"8nhyg46freg7m-20110124230951-sh7qe94c9eihx-20110125080328"}],"favorited":false,"created_at":"Mon Jan 24 14:09:51 +0000 2011","text":"元気足りない","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110124230951","reply_count":"4"},{"favorite_list":[{"profile_image_url":"http://profile.img.mixi.jp/photo/user/ezkjdy9s8rwsc_908263351.jpg","url":"http://mixi.jp/show_friend.pl?uid=ezkjdy9s8rwsc","id":"ezkjdy9s8rwsc","screen_name":"ザキ"},{"profile_image_url":"http://profile.img.mixi.jp/photo/user/byyodstjedqnc_3016348087.jpg","url":"http://mixi.jp/show_friend.pl?uid=byyodstjedqnc","id":"byyodstjedqnc","screen_name":"ちゃきぃ?いわ"},{"profile_image_url":"http://profile.img.mixi.jp/photo/user/wj484htgzgd78_3596577078.jpg","url":"http://mixi.jp/show_friend.pl?uid=wj484htgzgd78","id":"wj484htgzgd78","screen_name":"た〜〜〜こ"}],"favorited":false,"created_at":"Wed Jan 19 15:16:35 +0000 2011","text":"構造デザイン講義-内藤廣 を読んだ。デザインに関する哲学は参考になった。","user":{"profile_image_url":"http://profile.img.mixi.jp/photo/user/8nhyg46freg7m_1483702073.jpg","url":"http://mixi.jp/show_friend.pl?uid=8nhyg46freg7m","id":"8nhyg46freg7m","screen_name":"Kei +  ξ"},"id":"8nhyg46freg7m-20110120001635","favorite_count":"3"}]}');
		}
		
		initScript(jQuery);
		/*
		$('#main').streamPanel({
			'tweets':[{
					'tweet': '山にいきたいなー',
					'rank': 1
				}
			]
		});
		*/
		
		$('#main').streamPanel({"data": getJSON().contens});

		$('#related-voice-panel-main').detailStreamPanel();
		
		$(document).setupPages({
			'theme' : 'b'
		});
	});
})();
