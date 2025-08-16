export type WidgetType = 'notes' | 'links' | 'embed' | 'calendar'

export interface WidgetBase {
  id: string
  type: WidgetType
  x: number; y: number; w: number; h: number
}

export interface NotesWidget extends WidgetBase {
  type: 'notes'
  text: string
}

export interface LinksWidget extends WidgetBase {
  type: 'links'
  links: { label: string; url: string }[]
}

export interface EmbedWidget extends WidgetBase {
  type: 'embed'
  url: string
}

export interface CalendarWidget extends WidgetBase {
  type: 'calendar'
  url: string // use a Google Calendar embed URL
}

export type AnyWidget = NotesWidget | LinksWidget | EmbedWidget | CalendarWidget

export interface PageData {
  title: string
  widgets: AnyWidget[]
  updatedAt?: number
}
