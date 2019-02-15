import json
import numpy as np
import pandas as pd

project = [
    {
        'name': 'サンプルプロジェクト',
        'children': [
            {
                'name':'要件定義',
                'children': [
                    {
                        'name':'システム要件整理',
                    },
                    {
                        'name':'業務フロー定義',
                    },
                    {
                        'name':'機能定義',
                    },
                    {
                        'name':'データモデル定義',
                    },
                    {
                        'name':'非機能要件検討',
                    },
                    {
                        'name':'AP基盤要件定義',
                    },
                    {
                        'name':'システムアーキテクチャ概要設計',
                    },
                    {
                        'name':'移行要件定義',
                    },
                    {
                        'name':'サービス提供要件定義',
                    },
                ],
            },
            {
                'name':'AP構築',
                'children': [
                    {
                        'name':'AP基盤概要設計',
                    },
                    {
                        'name':'処理設計',
                    },
                    {
                        'name':'データモデル設計',
                    },
                    {
                        'name':'AP基盤詳細設計',
                    },
                    {
                        'name':'コンポーネント設計',
                    },
                    {
                        'name':'AP基盤構築',
                    },
                ]
            },
        ],
    }
]

def main(number):
    actor = [
        'Aさん',
        'Kさん',
        'Nさん',
        'Yさん',
    ]
    stage = [
        'ToDo',
        'Doing',
        'underReview',
        'Done'
    ]

    for p in project:
        for pp in p['children']:
            for ppp in pp['children']:
                ppp['tasks'] = []
                for n in range(number):
                    start = np.random.randint(15)
                    new_task = {
                        'title': 'Title ' + str(n),
                        'description': str([np.random.randint(100) for x in range(100)]),
                        'start': start,
                        'end': start + np.random.randint(15),
                        'asignee': actor[np.random.randint(4)],
                        'stage': stage[n%4]
                    }
                    ppp['tasks'].append(new_task)
    with open('sample_task_list.json', 'w', encoding='utf-8') as f:
        f.write(str(project))

if __name__ == '__main__':
    main(10)
