angular.module('starter.database', [])

.constant('SETTINGS', {

})

.constant('DB_CONFIG', {
    name: 'ahorratelo.db',
    tables: [
      	{
			name: 'category',
			fields: [
				{ name: 'category_id', type: 'integer' }, 
				{ name: 'name', type: 'text not null' }, 
				{ name: 'url', type: 'text not null' }
			], 
			keys: {
				primary: ['category_id'],
				foreign: []
			}
        }, 
        {
        	name: 'expense',
        	fields: [
        		{ name: 'expense_id', type: 'integer' },
        		{ name: 'infodate', type: 'date not null' },
        		{ name: 'category_id', type: 'integer not null' },
        		{ name: 'amount', type: 'integer not null' }
        	], 
        	keys: {
        		primary: ['expense_id'],
        		foreign: [
        			{
        				table: 'category',
        				fields: [
        					['category_id'],
        					['category_id']
        				]
        			}
        		]
        	}
        }
    ]
})

.constant('DB_DATA', {
    tables: [
        {
            name: 'category',
            fields: ['category_id', 'name', 'url'],
            values: [ 
                [1, 'Casa', '/img/home.png'],
                [2, 'Comunicación', '/img/communication.png'],
                [3, 'Entretenimiento', '/img/entertainment.png'],
                [4, 'Vehículo', '/img/vehicle.png'],
                [5, 'Otros gastos', '/img/other.png']
            ]
        }
    ]
})