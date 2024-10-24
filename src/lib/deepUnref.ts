/**
 * Inspired by https://github.com/DanHulton/vue-deepunref and converted to TypeScript
 */

import type { Ref } from 'vue'
import { isRef, unref } from 'vue'

type DeepUnrefArray<T> = Array<DeepUnref<T>>

type DeepUnrefObject<T> = {
  [K in keyof T]: DeepUnref<T[K]>;
}

export type DeepUnref<T> = T extends Ref<infer V>
  ? DeepUnref<V>
  : T extends Array<any>
    ? DeepUnrefArray<T[number]>
    : T extends object
      ? DeepUnrefObject<T>
      : T

const isObject = (val: unknown): val is Record<string, unknown> =>
  val !== null && typeof val === 'object'

const isArray = Array.isArray

/**
 * Deeply unref a value, recursing into objects and arrays.
 *
 * @param val - The value to deeply unref
 * @returns The deeply unreffed value
 */
export function deepUnref<T>(val: T): DeepUnref<T> {
  const checkedVal = isRef(val) ? unref(val) : val

  if (!isObject(checkedVal)) {
    return checkedVal as DeepUnref<T>
  }

  if (isArray(checkedVal)) {
    return unrefArray(checkedVal) as DeepUnref<T>
  }

  return unrefObject(checkedVal) as DeepUnref<T>
}

/**
 * Unref a value, recursing into it if it's an object.
 *
 * @param val - The value to unref
 * @returns The unreffed value
 */
function smartUnref<T>(val: T): DeepUnref<T> {
  // Non-ref object? Go deeper!
  if (val !== null && !isRef(val) && typeof val === 'object') {
    return deepUnref(val)
  }

  return unref(val as any) as DeepUnref<T>
}

/**
 * Unref an array, recursively.
 *
 * @param arr - The array to unref
 * @returns The unreffed array
 */
function unrefArray<T>(arr: T[]): DeepUnrefArray<T> {
  return arr.map(item => smartUnref(item)) as DeepUnrefArray<T>
}

/**
 * Unref an object, recursively.
 *
 * @param obj - The object to unref
 * @returns The unreffed object
 */
function unrefObject<T extends Record<string, unknown>>(obj: T): DeepUnrefObject<T> {
  const unreffed = {} as DeepUnrefObject<T>

  // Object? un-ref it!
  Object.keys(obj).forEach((key) => {
    unreffed[key as keyof T] = smartUnref(obj[key])
  })

  return unreffed
}
