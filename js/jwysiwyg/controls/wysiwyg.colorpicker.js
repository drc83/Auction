/**
 * Controls: Colorpicker plugin
 * 
 * Depends on jWYSIWYG, (farbtastic || other colorpicker plugins)
 */
(function($) {
if (undefined === $.wysiwyg) {
	throw "wysiwyg.colorpicker.js depends on $.wysiwyg";
}

if (!$.wysiwyg.controls) {
	$.wysiwyg.controls = {};
}

/*
 * Wysiwyg namespace: public properties and methods
 */
$.wysiwyg.controls.colorpicker = {
	color: {
		back: {
			prev: "#ffffff",
			palette: []
		},
		fore: {
			prev: "#123456",
			palette: []
		}
	},

	addColorToPalette: function(type, color) {
		if (-1 === $.inArray(color, this.color[type].palette)) {
			this.color[type].palette.push(color);
		}
		else {
			this.color[type].palette.sort(function (a, b) {
				if (a === color) {
					return 1;
				}

				return 0;
			});
		}
	},

	init: function(Wysiwyg) {
		var self = this;
		var elements, colorpickerHtml = '<form class="wysiwyg"><fieldset><legend>Colorpicker</legend><ul class="palette"></ul><label>Color: <input type="text" name="color" value="#123456"/></label><div class="wheel"></div><input type="submit" class="button" value="Apply"/> <input type="reset" value="Cancel"/></fieldset></form>';

		if ($.modal) {
			elements = $(colorpickerHtml);
	
			if ($.farbtastic) {
				this.renderPalette(elements, "fore");
				elements.find(".wheel").farbtastic(elements.find("input:text"));
			}
	
			$.modal(elements.html(), {
				onShow: function(dialog) {
					$("input:submit", dialog.data).click(function(e) {
						e.preventDefault();
						var color = $('input[name="color"]', dialog.data).val();
						self.color.fore.prev = color;
						self.addColorToPalette("fore", color);
						Wysiwyg.editorDoc.execCommand('ForeColor', false, color);
						$.modal.close();
					});
					$("input:reset", dialog.data).click(function(e) {
						e.preventDefault();
						$.modal.close();
					});
				},
				maxWidth: Wysiwyg.defaults.formWidth,
				maxHeight: Wysiwyg.defaults.formHeight,
				overlayClose: true
			});
		}
		else if ($.fn.dialog) {
			elements = $(colorpickerHtml);
	
			if ($.farbtastic) {
				this.renderPalette(elements, "fore");
				elements.find(".wheel").farbtastic(elements.find("input:text"));
			}
	
			var dialog = elements.appendTo("body");
			dialog.dialog({
				modal: true,
				width: Wysiwyg.defaults.formWidth,
				height: Wysiwyg.defaults.formHeight,
				open: function(event, ui) {
					$("input:submit", elements).click(function(e) {
						e.preventDefault();
						var color = $('input[name="color"]', dialog).val();
						self.color.fore.prev = color;
						self.addColorToPalette("fore", color);
						Wysiwyg.editorDoc.execCommand('ForeColor', false, color);
						$(dialog).dialog("close");
					});
					$("input:reset", elements).click(function(e) {
						e.preventDefault();
						$(dialog).dialog("close");
					});
				},
				close: function(event, ui){
					dialog.dialog("destroy");
				}
			});
		}
		else {
			if ($.farbtastic) {
				elements = $("<div/>")
					.css({"position": "absolute",
						"left": "50%", "top": "50%", "background": "rgb(0, 0, 0)",
						"margin-top": -1 * Math.round(Wysiwyg.defaults.formHeight / 2),
						"margin-left": -1 * Math.round(Wysiwyg.defaults.formWidth / 2)})
					.html(colorpickerHtml);
				this.renderPalette(elements, "fore");
				elements.find("input[name=color]").val(self.color.fore.prev);
				elements.find(".wheel").farbtastic(elements.find("input:text"));
				$("input:submit", elements).click(function(event) {
					event.preventDefault();
					var color = $('input[name="color"]', elements).val();
					self.color.fore.prev = color;
					self.addColorToPalette("fore", color);
					Wysiwyg.editorDoc.execCommand('ForeColor', false, color);
					$(elements).remove();
				});
				$("input:reset", elements).click(function(event) {
					event.preventDefault();
					$(elements).remove();
				});
				$("body").append(elements);
			}
		}
	},

	renderPalette: function(jqObj, type) {
		var i, palette = jqObj.find(".palette");
		var bind = function() {
			var color = $(this).text();
			jqObj.find("input[name=color]").val(color);
			// farbtastic binds on keyup
			jqObj.find("input[name=color]").trigger("keyup");
		};

		for (i = this.color[type].palette.length; i-- > 0; i) {
			var colorExample = $("<div/>").css({
				"float": "left",
				"width": "16px",
				"height": "16px",
				"margin": "0px 5px 0px 0px",
				"background-color": this.color[type].palette[i]
			});

			var colorSelect = $("<li>" + this.color[type].palette[i] + "</li>")
				.css({"float": "left", "list-style": "none"})
				.append(colorExample)
				.bind("click.wysiwyg", bind);

			palette.append(colorSelect).css({"margin": "0px", "padding": "0px"});
		}
	}
};

})(jQuery);