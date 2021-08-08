/**
 * @author Jan Ackermann
 * @copyright 2021 Jan Ackermann jackermann@owncloud.com
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the LICENSE file.
 */

(function (OCA) {

	OCA.FilesEmbeddedPdfViewer = OCA.FilesEmbeddedPdfViewer || {};

	/**
	 * @namespace OCA.FilesPdfViewer.AppPlugin
	 */
	OCA.FilesEmbeddedPdfViewer.AppPlugin = {

		/**
		 * @param fileList
		 */
		attach: function (fileList) {
			this.extendFileActions(fileList.fileActions);
		},

		/**
		 * @param fileActions
		 * @private
		 */
		extendFileActions: function (fileActions) {
			var self = this;
			fileActions.registerAction({
				name: 'FilesEmbeddedPdfViewer',
				displayName: t('files_embeddedpdfviewer', 'View PDF'),
				mime: 'application/pdf',
				iconClass: 'icon-toggle',
				permissions: OC.PERMISSION_READ,
				actionHandler: function (fileName, context) {
					self.show(fileName, context.dir, context.fileList);
				}
			});
			fileActions.setDefault('application/pdf', 'FilesEmbeddedPdfViewer');
		},

		/**
		 * @param fileName
		 * @param dir
		 */
		show: function(fileName, dir){
				var self = this;
				$.get(
				OC.generateUrl('/apps/files_embeddedpdfviewer/load'),
				{
					fileName: fileName,
					dir: dir
				}
			).done(function(template) {
				self.render(template);
			});
		},

		/**
		 * @param template
		 */
		render: function (template){
			var that = this;
			var $controls = $('#app-content #controls');
			var $closeButton = $('<button class="close-pdf-button">' + t('files_embeddedpdfviewer', 'Close PDF') + '</button>').appendTo("#header");

			$controls.addClass('hidden');
			$(template).appendTo('#app-content');
			FileList.setViewerMode(true);

			$closeButton.on('click', function (){
				that.hide();
			});

			$(window).keyup(function(e) {
				if (e.key === "Escape") {
					that.hide();
				}
			});
		},

		hide: function (){
			var $controls = $('#app-content #controls');
			var $closeButton = $('.close-pdf-button');
			var $template = $('.pdf-viewer');

			$controls.removeClass('hidden');
			$closeButton.remove();
			$template.remove();
			FileList.setViewerMode(false);
		}

	};

})(OCA);

OC.Plugins.register('OCA.Files.FileList', OCA.FilesEmbeddedPdfViewer.AppPlugin);
