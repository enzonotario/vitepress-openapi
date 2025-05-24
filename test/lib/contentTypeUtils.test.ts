import { describe, expect, it } from 'vitest'
import { isFormUrlEncoded, isJson, isMultipartFormData, isXml } from '../../src/lib/contentTypeUtils'

describe('contentTypeUtils', () => {
  describe('isJson', () => {
    it('should return true for application/json', () => {
      expect(isJson('application/json')).toBe(true)
    })

    it('should return true for application/json with charset', () => {
      expect(isJson('application/json; charset=utf-8')).toBe(true)
    })

    it('should return true for text/json', () => {
      expect(isJson('text/json')).toBe(true)
    })

    it('should return true for application/vnd.api+json', () => {
      expect(isJson('application/vnd.api+json')).toBe(true)
    })

    it('should return true for application/json+custom', () => {
      expect(isJson('application/json+custom')).toBe(true)
    })

    it('should return false for application/xml', () => {
      expect(isJson('application/xml')).toBe(false)
    })

    it('should return false for text/plain', () => {
      expect(isJson('text/plain')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isJson('')).toBe(false)
    })
  })

  describe('isXml', () => {
    it('should return true for application/xml', () => {
      expect(isXml('application/xml')).toBe(true)
    })

    it('should return true for application/xml with charset', () => {
      expect(isXml('application/xml; charset=utf-8')).toBe(true)
    })

    it('should return true for text/xml', () => {
      expect(isXml('text/xml')).toBe(true)
    })

    it('should return true for application/vnd.api+xml', () => {
      expect(isXml('application/vnd.api+xml')).toBe(true)
    })

    it('should return true for application/xml+custom', () => {
      expect(isXml('application/xml+custom')).toBe(true)
    })

    it('should return false for application/json', () => {
      expect(isXml('application/json')).toBe(false)
    })

    it('should return false for text/plain', () => {
      expect(isXml('text/plain')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isXml('')).toBe(false)
    })
  })

  describe('isFormUrlEncoded', () => {
    it('should return true for application/x-www-form-urlencoded', () => {
      expect(isFormUrlEncoded('application/x-www-form-urlencoded')).toBe(true)
    })

    it('should return true for application/x-www-form-urlencoded with charset', () => {
      expect(isFormUrlEncoded('application/x-www-form-urlencoded; charset=utf-8')).toBe(true)
    })

    it('should return true for application/x-www-form-urlencoded+custom', () => {
      expect(isFormUrlEncoded('application/x-www-form-urlencoded+custom')).toBe(true)
    })

    it('should return false for application/json', () => {
      expect(isFormUrlEncoded('application/json')).toBe(false)
    })

    it('should return false for multipart/form-data', () => {
      expect(isFormUrlEncoded('multipart/form-data')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isFormUrlEncoded('')).toBe(false)
    })
  })

  describe('isMultipartFormData', () => {
    it('should return true for multipart/form-data', () => {
      expect(isMultipartFormData('multipart/form-data')).toBe(true)
    })

    it('should return true for multipart/form-data with boundary', () => {
      expect(isMultipartFormData('multipart/form-data; boundary=something')).toBe(true)
    })

    it('should return true for multipart/form-data+custom', () => {
      expect(isMultipartFormData('multipart/form-data+custom')).toBe(true)
    })

    it('should return false for application/json', () => {
      expect(isMultipartFormData('application/json')).toBe(false)
    })

    it('should return false for application/x-www-form-urlencoded', () => {
      expect(isMultipartFormData('application/x-www-form-urlencoded')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isMultipartFormData('')).toBe(false)
    })
  })
})
