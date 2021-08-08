<?php
/**
 * @author Jan Ackermann
 * @copyright 2021 Jan Ackermann jackermann@owncloud.com
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the LICENSE file.
 */

namespace OCA\Files_EmbeddedPdfViewer\Controller;

use OC\Files\View;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;
use OCP\IURLGenerator;
use OCP\Share\IManager;

class DisplayController extends Controller {

	/** @var IURLGenerator */
	private $urlGenerator;

	/** @var View */
	private $view;


	/**
	 * @param string $AppName
	 * @param IRequest $request
	 * @param IManager $shareManager
	 * @param View $view
	 */
	public function __construct(
		$AppName,
		IRequest $request,
		View $view
	) {
		parent::__construct($AppName, $request);
		$this->view = $view;
	}

	/**
	 * load text file
	 *
	 * @NoAdminRequired
	 *
	 * @param string $dir
	 * @param string $fileName
	 * @return TemplateResponse
	 */
	public function showPdfViewer(string $dir, string $fileName) {

		$path = $dir . '/'. $fileName;
		$fileContents = $this->view->file_get_contents($path);

		$params = [
			'pdfData' => base64_encode($fileContents),
		];

		$response = new TemplateResponse($this->appName, 'viewer', $params, 'blank');

		$policy = new ContentSecurityPolicy();
		$policy->addAllowedChildSrcDomain('\'self\'');
		$policy->addAllowedFontDomain('data:');
		$policy->addAllowedImageDomain('*');
		$policy->addAllowedObjectDomain('\'self\'');
		$policy->addAllowedConnectDomain('blob: data:');
		$policy->addAllowedObjectDomain('\'data\'');
		$policy->allowEvalScript(true);
		$response->setContentSecurityPolicy($policy);

		return $response;
	}
}
