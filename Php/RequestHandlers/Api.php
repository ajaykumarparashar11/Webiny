<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\RequestHandlers;

use Apps\Webiny\Php\DevTools\Response\ApiResponse;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\DevTools\Exceptions\AppException;
use Apps\Webiny\Php\DevTools\Response\ApiErrorResponse;
use Webiny\Component\StdLib\StdLibTrait;

class Api
{
    use WebinyTrait, StdLibTrait;

    private $apiResponse = '\Apps\Webiny\Php\DevTools\Response\ApiResponse';
    private $apiEvent;

    public function handle()
    {
        if (!$this->wRequest()->isApi()) {
            return null;
        }

        try {
            header("Access-Control-Allow-Origin: *");
            $this->apiEvent = new ApiEvent();

            $response = null;

            $this->wEvents()->fire('Webiny.Api.Before', $this->apiEvent, $this->apiResponse);
            if ($this->apiEvent->getResponse() instanceof ApiResponse) {
                return $this->apiEvent->getResponse();
            }

            $response = $this->wEvents()->fire('Webiny.Api.Request', $this->apiEvent, $this->apiResponse, 1);
            $this->apiEvent->setResponse($response);

            $this->wEvents()->fire('Webiny.Api.After', $this->apiEvent, $this->apiResponse);
            if ($this->apiEvent->getResponse() instanceof ApiResponse) {
                $response = $this->apiEvent->getResponse();
            }

            return $response;
        } catch (ApiException $e) {
            return new ApiErrorResponse($e->getData(), $e->getErrorMessage(), $e->getErrorCode(), $e->getResponseCode());
        } catch (AppException $e) {
            return new ApiErrorResponse($e->getData(), $e->getErrorMessage(), $e->getErrorCode(), 404);
        } catch (\Exception $e) {
            return new ApiErrorResponse(null, $e->getMessage(), $e->getCode(), 404);
        }
    }
}